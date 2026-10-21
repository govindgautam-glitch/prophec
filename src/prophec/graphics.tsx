import type { ReactNode } from 'react';
const icons: Record<string, ReactNode> = {
  "arrow": <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  "diagonal": <><path d="M6 18 18 6M6 6h12v12"/></>,
  "search": <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  "close": <><path d="m6 6 12 12M18 6 6 18"/></>,
  "spark": <><path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z"/></>,
  "headset": <><path d="M4 14v-2a8 8 0 0 1 16 0v2M20 16v2a3 3 0 0 1-3 3h-4"/><rect x="2" y="11" width="5" height="8" rx="2"/><rect x="17" y="11" width="5" height="8" rx="2"/></>,
  "flow": <><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M9 6h6a3 3 0 0 1 3 3v6M3 18h6M6 15v6"/></>,
  "shield": <><path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  "chip": <><rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></>,
  "devices": <><rect x="2" y="4" width="15" height="12" rx="2"/><path d="M5 21h9M10 16v5"/><rect x="16" y="10" width="6" height="11" rx="1.5"/></>,
  "database": <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/></>,
  "design": <><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 10h16M10 10v10"/></>,
  "mail": <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>,
  "chat": <><path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0Z"/><path d="M7 10h10M7 14h6"/></>,
  "users": <><circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/></>,
  "check": <><path d="m5 12 4 4L19 6"/></>,
  "plus": <><path d="M12 5v14M5 12h14"/></>,
  "shuffle": <><path d="M3 6h3l12 12h3M17 14l4 4-4 4M3 18h3L18 6h3M17 2l4 4-4 4"/></>,
  "reset": <><path d="M4 10a8 8 0 1 1 0 6M4 3v7h7"/></>
};
export type IconName = "arrow" | "diagonal" | "search" | "close" | "spark" | "headset" | "flow" | "shield" | "chip" | "devices" | "database" | "design" | "mail" | "chat" | "users" | "check" | "plus" | "shuffle" | "reset";
export function Icon({name,className='icon'}:{name:IconName;className?:string}){return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icons[name]}</svg>}
const illustrations: Record<string, ReactNode> = {l:<><g fill="none"><path d="m100 15 65 28-65 29-65-29 65-28Z"/><path d="m35 57 65 29 65-29M35 72l65 29 65-29" opacity=".45"/><path d="M100 15v57M35 43l65 29 65-29" opacity=".3"/></g><circle cx="100" cy="43" r="7" fill="#091c09" stroke="none"/></>,b:<><path d="M49 29 100 55l52-26M49 83l51-28 52 28" opacity=".5"/><circle cx="100" cy="55" r="22" fill="white"/><rect x="90" y="46" width="20" height="17" rx="5"/><path d="M100 46v-6M96 53v3M104 53v3"/><g fill="white"><rect x="29" y="16" width="38" height="25" rx="7"/><rect x="134" y="16" width="38" height="25" rx="7"/><rect x="29" y="71" width="38" height="25" rx="7"/><rect x="134" y="71" width="38" height="25" rx="7"/></g><path d="M40 29h16M145 29h16M40 83h16M145 83h16" opacity=".5"/></>,n:<><path d="M50 44h33M116 44h34M163 58v24H38V59" opacity=".5"/><g fill="white"><rect x="20" y="25" width="38" height="38" rx="10"/><rect x="81" y="25" width="38" height="38" rx="10"/><rect x="142" y="25" width="38" height="38" rx="10"/></g><path d="m33 44 5 5 9-11M94 44h12M100 38v12M153 44h16m-6-6 6 6-6 6"/><circle cx="100" cy="82" r="4" fill="#091c09" stroke="none"/></>,a:<><path d="M28 90h145M28 90V20" opacity=".25"/><g fill="#091c09" stroke="none"><rect x="44" y="62" width="19" height="28" rx="3" opacity=".2"/><rect x="76" y="48" width="19" height="42" rx="3" opacity=".4"/><rect x="108" y="37" width="19" height="53" rx="3" opacity=".65"/><rect x="140" y="21" width="19" height="69" rx="3"/></g><path d="m44 48 36-18 32 1 44-20"/><circle cx="156" cy="11" r="3" fill="#091c09"/></>,s:<><g opacity=".45"><path d="M72 39H42V24H22M128 39h30V24h20M72 71H42v16H22M128 71h30v16h20M90 28V9M110 28V9M90 82v19M110 82v19"/></g><rect x="72" y="28" width="56" height="54" rx="12" fill="white"/><rect x="86" y="42" width="28" height="26" rx="6"/><path d="M95 50h10v10H95Z"/><g fill="#091c09" stroke="none"><circle cx="22" cy="24" r="4"/><circle cx="178" cy="24" r="4"/><circle cx="22" cy="87" r="4"/><circle cx="178" cy="87" r="4"/></g></>,c:<><path d="m100 13 55 27v37l-55 27-55-27V40l55-27Z"/><path d="m45 40 55 27 55-27M100 67v37M100 13v36m-35 1 35-17 35 17" opacity=".4"/><circle cx="100" cy="67" r="6" fill="#091c09"/><path d="M23 55h12M165 55h12M100 2v6" opacity=".5"/></>};
export type ServiceGraphic = 'l'|'b'|'n'|'a'|'s'|'c';
export function ServiceIllustration({name}:{name:ServiceGraphic}){return <svg viewBox="0 0 200 110" aria-hidden="true">{illustrations[name]}</svg>}
