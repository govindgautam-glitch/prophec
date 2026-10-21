import type { ServiceItem, ServicesUI } from './types';
/** Original 1470ms articulated sequence, with instance-local DOM and teardown. */
type PoseKey = [number,number,number,number];
const forward:PoseKey[]=[[0,0,0,0],[110,-3,-5,5],[365,48,66,-24],[480,44,59,-15],[690,69,18,12],[890,65,22,4],[1160,26,27,-7],[1470,0,0,0]];
const backward:PoseKey[]=[[0,0,0,0],[110,-3,-4,4],[365,66,20,6],[480,64,22,5],[690,40,75,-24],[890,43,65,-15],[1160,23,26,-8],[1470,0,0,0]];
type Job={target:number;from:number;direction:number;started:number;committed:boolean;grip:Animation|null;animations:Animation[]};
export function mountServices(scene:HTMLElement,items:readonly ServiceItem[],ui:ServicesUI){
 const q=<T extends Element>(name:string)=>scene.querySelector<T>(`[data-part="${name}"]`)!;
 const rig=(name:string)=>scene.querySelector<SVGElement>(`[data-rig="${name}"]`)!;
 const stack=q<HTMLDivElement>('stack'),dots=q<HTMLDivElement>('dots');
 const cards=Array.from(stack.querySelectorAll<HTMLElement>('.card')),db=Array.from(dots.querySelectorAll<HTMLButtonElement>('button'));
 const prev=q<HTMLButtonElement>('prev'),next=q<HTMLButtonElement>('next'),toggle=q<HTMLButtonElement>('motion'),robot=q<HTMLButtonElement>('robot-trigger'),robotControl=q<HTMLButtonElement>('robot-swap'),cue=q<HTMLSpanElement>('robot-cue-text'),parallax=scene.querySelector<HTMLElement>('.robot-parallax')!;
 const shoulder=rig('shoulder-joint'),elbow=rig('elbow-joint'),wrist=rig('wrist-joint'),palm=rig('palm-anchor') as SVGGraphicsElement;
 const field=q<SVGSVGElement>('gesture-field'),thread=q<SVGPathElement>('gesture-thread'),pulse=q<SVGPathElement>('gesture-pulse'),contact=q<SVGCircleElement>('gesture-contact'),halo=q<SVGCircleElement>('gesture-halo');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine) and (min-width:701px)');
 const abort=new AbortController();const disposers:(()=>void)[]=[];
 const on=(target:EventTarget,event:string,fn:EventListener,passive=false)=>target.addEventListener(event,fn,{signal:abort.signal,passive});
 let i=0,tx:Job|null=null,queued:number|null=null,manualPause=false,inView=true,pointerFrame=0,gestureFrame=0,disposed=false;
 const clamp=(n:number)=>Math.max(0,Math.min(items.length-1,n));
 const canMove=()=>!manualPause&&!reduce.matches&&!document.hidden&&inView;
 const logical=()=>queued??tx?.target??i;
 function render(n:number){
  i=clamp(n);const oldFocus=document.activeElement;
  cards.forEach((c,k)=>{c.dataset.pos=String(Math.max(-1,Math.min(3,k-i)));c.querySelector<HTMLElement>('.inq')!.tabIndex=k===i?0:-1;c.setAttribute('aria-hidden',String(k!==i));c.inert=k!==i;});
  if(cards.some((c,k)=>k!==i&&oldFocus&&c.contains(oldFocus)))stack.focus({preventScroll:true});
  db.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-current',String(k===i))});
  prev.disabled=i===0;next.disabled=i===items.length-1;
  q<HTMLElement>('cnt').textContent=`${String(i+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
  q<HTMLElement>('announcement').textContent=`${items[i].title}, ${i+1} / ${items.length}`;
 }
 function pose(s=0,e=0,w=0){shoulder.setAttribute('transform',`rotate(${s.toFixed(3)} 357 658)`);elbow.setAttribute('transform',`rotate(${e.toFixed(3)} 254 794)`);wrist.setAttribute('transform',`rotate(${w.toFixed(3)} 195 918)`);}
 function sample(keys:PoseKey[],ms:number){let n=0;while(n<keys.length-2&&ms>keys[n+1][0])n++;const a=keys[n],b=keys[n+1];let t=Math.max(0,Math.min(1,(ms-a[0])/(b[0]-a[0])));t=t*t*(3-2*t);pose(a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t);}
 function drawThread(active:HTMLElement,ms:number){const m=palm.getScreenCTM();if(!m)return;const r=scene.getBoundingClientRect(),c=active.getBoundingClientRect(),p=new DOMPoint(170,984).matrixTransform(m),x=p.x-r.left,y=p.y-r.top,endX=c.right-r.left-28,endY=c.top-r.top+25;
  const alpha=Math.min(1,Math.max(0,(ms-220)/140))*Math.min(1,Math.max(0,(780-ms)/200));field.style.opacity=String(alpha*.85);field.setAttribute('viewBox',`0 0 ${scene.clientWidth} ${scene.clientHeight}`);
  const bend=Math.min(85,Math.abs(endX-x)*.24+25),d=`M ${x} ${y} C ${x-45} ${y-bend}, ${endX+36} ${endY-34}, ${endX} ${endY}`;thread.setAttribute('d',d);pulse.setAttribute('d',d);pulse.style.strokeDashoffset=String(70-(ms-220)*.42);for(const node of [contact,halo]){node.setAttribute('cx',String(x));node.setAttribute('cy',String(y))}halo.setAttribute('r',String(8+Math.sin(Math.max(0,ms-220)/560*Math.PI)*5));
 }
 function animateCards(job:Job){
  if(job.committed)return;job.committed=true;
  const from=cards.map(c=>({transform:getComputedStyle(c).transform,opacity:getComputedStyle(c).opacity}));job.grip?.cancel();const old=cards[i];
  if(old.contains(document.activeElement))stack.focus({preventScroll:true});render(job.target);
  const to=cards.map(c=>({transform:getComputedStyle(c).transform,opacity:getComputedStyle(c).opacity}));
  cards.forEach((c,k)=>{let frames:Keyframe[]=[from[k],to[k]];if(k===i){const sign=job.direction,nearby=Math.abs(job.target-job.from)===1;frames=[{transform:nearby?from[k].transform:`translateX(${sign*120}px) translateY(5px) rotate(${sign*7}deg) scale(.93)`,opacity:1,offset:0},{transform:`translateX(${-sign*2}px) translateY(-1px) rotate(${-sign*.3}deg) scale(1)`,opacity:1,offset:.82},{transform:to[k].transform,opacity:1,offset:1}]};job.animations.push(c.animate(frames,{duration:k===i?710:650,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));});old.style.zIndex='4';
 }
 function clean(job:Job|null){cancelAnimationFrame(gestureFrame);gestureFrame=0;job?.grip?.cancel();job?.animations.forEach(a=>a.cancel());cards.forEach(c=>c.style.removeProperty('z-index'));field.style.opacity='0';pose();scene.dataset.gesture='false';scene.dataset.busy='false';stack.setAttribute('aria-busy','false');cue.textContent=ui.tap;}
 function settle(){if(!tx)return;const target=queued??tx.target;clean(tx);tx=null;queued=null;scene.dataset.gesture='true';render(target);void stack.offsetWidth;scene.dataset.gesture='false';}
 function request(n:number,direction?:number){n=clamp(n);if(tx){queued=n;return}if(n===i)return;if(!canMove()||typeof cards[0].animate!=='function'){render(n);return}cancelAnimationFrame(pointerFrame);
  const job:Job={target:n,from:i,direction:direction??(n>i?1:-1),started:performance.now(),committed:false,grip:null,animations:[]};tx=job;scene.dataset.gesture='true';scene.dataset.busy='true';stack.setAttribute('aria-busy','true');cue.textContent=ui.swapping;
  const tick=(now:number)=>{if(disposed||tx!==job)return;const ms=now-job.started;sample(job.direction>0?forward:backward,ms);
   if(ms>=270&&!job.grip&&!job.committed)job.grip=cards[job.from].animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(-7px) rotate(${-job.direction*1.1}deg)`}],{duration:230,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   if(ms>=500)animateCards(job);drawThread(cards[job.from],ms);
   if(ms>=1470){if(!job.committed)render(job.target);const target=queued;queued=null;clean(job);tx=null;if(target!==null&&target!==i)request(target,target>i?1:-1);return}gestureFrame=requestAnimationFrame(tick);
  };gestureFrame=requestAnimationFrame(tick);
 }
 const step=(delta:number)=>request(logical()+delta,delta),robotNext=()=>request((logical()+1)%items.length,1);
 on(robot,'click',robotNext);on(robotControl,'click',robotNext);on(prev,'click',()=>step(-1));on(next,'click',()=>step(1));db.forEach((b,k)=>on(b,'click',()=>request(k)));
 render(0);scene.dataset.busy='false';scene.dataset.gesture='false';
 const sizeStage=()=>{if(disposed)return;const h=Math.max(...cards.map(c=>c.offsetHeight));if(h>0)stack.style.height=`${h+40}px`};sizeStage();document.fonts?.ready.then(sizeStage);
 const ro=new ResizeObserver(sizeStage);cards.forEach(c=>ro.observe(c));disposers.push(()=>ro.disconnect());on(window,'resize',()=>{settle();sizeStage()},true);
 on(stack,'keydown',event=>{const e=event as KeyboardEvent;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}else if(e.key==='Home'||e.key==='End'){e.preventDefault();request(e.key==='Home'?0:items.length-1)}});
 let swipe:{x:number;y:number}|null=null;
 on(stack,'touchstart',event=>{const e=event as TouchEvent;swipe=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},true);
 on(stack,'touchend',event=>{const e=event as TouchEvent;if(!swipe||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-swipe.x,dy=e.changedTouches[0].clientY-swipe.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)step(dx<0?1:-1);swipe=null},true);on(stack,'touchcancel',()=>{swipe=null},true);
 const resetPointer=()=>{cancelAnimationFrame(pointerFrame);['--pointer-x','--pointer-y','--pointer-ry'].forEach(k=>parallax.style.removeProperty(k))};
 function syncMotion(){const paused=!canMove();scene.dataset.motionPaused=String(paused);toggle.textContent=reduce.matches?ui.reduced:manualPause?ui.resume:ui.pause;toggle.setAttribute('aria-pressed',String(manualPause||reduce.matches));toggle.disabled=reduce.matches;if(paused){settle();resetPointer()}}
 on(toggle,'click',()=>{manualPause=!manualPause;syncMotion()});on(reduce,'change',syncMotion);on(document,'visibilitychange',syncMotion);on(fine,'change',resetPointer);
 const io=new IntersectionObserver(([e])=>{inView=e.isIntersecting;syncMotion()},{threshold:.03});io.observe(scene);disposers.push(()=>io.disconnect());syncMotion();
 on(scene,'pointermove',event=>{const e=event as PointerEvent;if(tx||!canMove()||!fine.matches||e.pointerType==='touch')return;cancelAnimationFrame(pointerFrame);const {clientX,clientY}=e;pointerFrame=requestAnimationFrame(()=>{const r=scene.getBoundingClientRect(),x=(clientX-r.left)/r.width-.5,y=(clientY-r.top)/r.height-.5;parallax.style.setProperty('--pointer-x',`${x*20}px`);parallax.style.setProperty('--pointer-y',`${y*12}px`);parallax.style.setProperty('--pointer-ry',`${x*6}deg`)})});
 on(scene,'pointerleave',()=>{cancelAnimationFrame(pointerFrame);if(!tx)resetPointer()});
 return ()=>{disposed=true;abort.abort();disposers.forEach(fn=>fn());clean(tx);tx=null;queued=null;resetPointer();stack.style.removeProperty('height')};
}
