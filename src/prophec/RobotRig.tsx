'use client';
import {useId} from 'react';
export function RobotRig({src='/prophec/robot-original.png'}:{src?:string}){const prefix=useId().replace(/:/g,'');const id=(s:string)=>prefix+'-'+s;return (<svg className="robot-rig" id={id('robot-rig')} data-rig="robot-rig" viewBox="0 0 1024 1536" aria-hidden="true" focusable="false">
  <defs>
    <image id={id('robot-pixels')} data-rig="robot-pixels" href={src} width="1024" height="1536"/>
    
    <path id={id('arm-outline')} data-rig="arm-outline" d="M 195 575 L 365 585 L 382 613 L 365 676 L 350 730 L 337 774 L 322 805 L 323 869 L 283 932 L 256 962 L 258 1097 L 86 1097 L 79 965 L 134 885 L 141 804 Z"/>
    <clipPath id={id('arm-silhouette')} data-rig="arm-silhouette"><use href={'#'+id('arm-outline')}/></clipPath>
    <mask id={id('body-without-arm')} data-rig="body-without-arm" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{maskType:"luminance"}}>
      <rect width="1024" height="1536" fill="white"/><use href={'#'+id('arm-outline')} fill="black"/>
    </mask>
    <clipPath id={id('upper-arm-cut')} data-rig="upper-arm-cut"><path d="M -100 -100 H 1200 V 1176 L -100 656 Z"/></clipPath>
    <clipPath id={id('forearm-cut')} data-rig="forearm-cut"><path d="M -100 652 L 1200 1172 V 1415 L -100 765 Z"/></clipPath>
    <clipPath id={id('hand-cut')} data-rig="hand-cut"><path d="M -100 760 L 1200 1410 V 1700 H -100 Z"/></clipPath>
    <linearGradient id={id('joint-metal')} data-rig="joint-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#101719"/><stop offset=".42" stopColor="#3d4445"/><stop offset=".65" stopColor="#111719"/><stop offset="1" stopColor="#080b0c"/></linearGradient>
  </defs>
  <use href={'#'+id('robot-pixels')} mask={'url(#'+id('body-without-arm')+')'}/>
  <g id={id('shoulder-joint')} data-rig="shoulder-joint" transform="rotate(0 357 658)">
    <ellipse cx="357" cy="658" rx="17" ry="36" transform="rotate(22 357 658)" fill={'url(#'+id('joint-metal')+')'}/>
    <g clipPath={'url(#'+id('arm-silhouette')+')'}><use href={'#'+id('robot-pixels')} clipPath={'url(#'+id('upper-arm-cut')+')'}/></g>
    <g id={id('elbow-joint')} data-rig="elbow-joint" transform="rotate(0 254 794)">
      <ellipse cx="254" cy="794" rx="40" ry="19" transform="rotate(23 254 794)" fill={'url(#'+id('joint-metal')+')'}/>
      <g clipPath={'url(#'+id('arm-silhouette')+')'}><use href={'#'+id('robot-pixels')} clipPath={'url(#'+id('forearm-cut')+')'}/></g>
      <g id={id('wrist-joint')} data-rig="wrist-joint" transform="rotate(0 195 918)">
        <ellipse cx="195" cy="918" rx="28" ry="18" transform="rotate(27 195 918)" fill={'url(#'+id('joint-metal')+')'}/>
        <g clipPath={'url(#'+id('arm-silhouette')+')'}><use href={'#'+id('robot-pixels')} clipPath={'url(#'+id('hand-cut')+')'}/></g>
        <circle id={id('palm-anchor')} data-rig="palm-anchor" cx="170" cy="984" r="1" opacity="0"/>
      </g>
    </g>
  </g>
</svg>);}
