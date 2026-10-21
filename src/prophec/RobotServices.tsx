'use client';
import { useEffect, useId, useRef } from 'react';
import { RobotRig } from './RobotRig';
import { ServiceIllustration } from './graphics';
import { ActionLink, MotionScope } from './primitives';
import { mountServices } from './service-controller';
import { numberLabel, type ServicesContent } from './types';
export function RobotServices({content:c,id='services',robotSrc='/prophec/robot-original.png'}:{content:ServicesContent;id?:string;robotSrc?:string}){
 const uid=useId().replace(/:/g,''),ref=useRef<HTMLElement>(null),stackId=uid+'-stack';
 useEffect(()=>{if(ref.current&&c.items.length)return mountServices(ref.current,c.items,c.ui)},[c.items,c.ui]);
 if(!c.items.length)throw new Error('RobotServices requires existing project service content.');
 return <MotionScope><section className="pc-services" id={id} ref={ref} aria-labelledby={uid+'-heading'} data-pc="services"><div className="premium-atmosphere" aria-hidden="true"><div className="premium-grid"/><div className="premium-orb"/></div>
 {(c.barLabel||c.barNote)&&<header className="brandbar"><span className="kicker">{c.barLabel}</span><span className="brandnote">{c.barNote}</span></header>}
 <div className="bg"><div className="robot-path"><div className="robot-parallax"><div className="robot-float"><div className="robot-figure"><RobotRig src={robotSrc}/><button className="robot-trigger" data-part="robot-trigger" type="button" aria-label={c.ui.robotButton} aria-controls={stackId} aria-describedby={uid+'-help'}><span className="robot-cue"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg><span data-part="robot-cue-text">{c.ui.tap}</span></span></button><span className="robot-shadow" aria-hidden="true"/></div></div></div></div></div>
 <svg className="gesture-field" data-part="gesture-field" aria-hidden="true" focusable="false"><path data-part="gesture-thread" className="gesture-thread"/><path data-part="gesture-pulse" className="gesture-pulse"/><circle data-part="gesture-halo" className="gesture-halo" r="10"/><circle data-part="gesture-contact" className="gesture-contact" r="3"/></svg><span className="sr-only" id={uid+'-help'}>{c.ui.robotHelp}</span>
 <div className="top"><div><p className="eyebrow">{c.eyebrow}</p><h2 id={uid+'-heading'}>{c.heading}</h2><p className="sub">{c.description}</p></div></div>
 <div className="stack" data-part="stack" id={stackId} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={c.ui.carouselLabel}>
 {c.items.map((item,k)=><article key={item.id} className="card" data-pos={Math.min(3,k)} role="group" aria-label={item.title} aria-hidden={k!==0}><div className="panel"><span className="tag">{item.tag}</span><span className="num">{numberLabel(k+1)}</span><div className="ico"><ServiceIllustration name={item.graphic}/></div>{item.caption?<div className="line">{item.caption}</div>:<div className="bars" aria-hidden="true"><i/><i/><i/></div>}</div><h3>{item.title}</h3><p>{item.description}</p><div className="foot"><span>{item.category}</span><ActionLink className="inq" action={item.action} tabIndex={k===0?0:-1}/></div></article>)}
 </div><div className="ctrl"><button data-part="prev" className="nav-btn" type="button" aria-label={c.ui.previous} aria-controls={stackId} disabled>‹</button><div className="dots" data-part="dots" role="group" aria-label={c.ui.chooseLabel}>{c.items.map((s,k)=><button type="button" key={s.id} className={k===0?'on':''} aria-label={s.title} aria-controls={stackId} aria-current={k===0}/>)}</div><button data-part="next" className="nav-btn" type="button" aria-label={c.ui.next} aria-controls={stackId} disabled={c.items.length===1}>›</button><div className="count"><b aria-hidden="true"/><span data-part="cnt">01 / {numberLabel(c.items.length)}</span></div></div>
 <span data-part="announcement" className="sr-only" role="status" aria-live="polite" aria-atomic="true"/><footer className="scene-footer"><button className="robot-control" data-part="robot-swap" type="button" aria-controls={stackId}><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="6" width="14" height="11" rx="4"/><path d="M10 6V3M7 10v2M13 10v2"/></svg><span>{c.ui.footerSwap}</span></button><button data-part="motion" className="motion-toggle" type="button" aria-pressed="false">{c.ui.pause}</button></footer>
 </section></MotionScope>;
}
