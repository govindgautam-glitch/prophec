'use client';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import type { Action } from './types';
import { Icon, type IconName } from './graphics';
export function ActionLink({action,className='',icon='diagonal',tabIndex}:{action:Action;className?:string;icon?:IconName;tabIndex?:number}){
  const children=<>{action.label}<Icon name={icon}/></>;
  return action.href!==undefined
    ? <a className={className} href={action.href} aria-label={action.ariaLabel} tabIndex={tabIndex}>{children}</a>
    : <button className={className} type="button" onClick={action.onClick} aria-label={action.ariaLabel} tabIndex={tabIndex}>{children}</button>;
}
export function MotionScope({children,className=''}:{children:ReactNode;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
   const el=ref.current!;const media=matchMedia('(prefers-reduced-motion: reduce)');let visible=true;
   const sync=()=>{el.dataset.motion=media.matches||document.hidden||!visible?'paused':'running'};
   const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()});io.observe(el);
   media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
   return ()=>{io.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)};
 },[]);
 return <div className={'prophec-kit '+className} ref={ref}>{children}</div>;
}
export function usePanelMotion(ref:RefObject<HTMLElement|null>,value:number){
 useEffect(()=>{if(!ref.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const a=ref.current.animate([{opacity:.55,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:290,easing:'cubic-bezier(.22,1,.36,1)'});return ()=>a.cancel();},[ref,value]);
}
