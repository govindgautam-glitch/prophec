'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './graphics';
import { ActionLink, MotionScope, usePanelMotion } from './primitives';
import { numberLabel, type HeroContent } from './types';
/** Four reference nodes. Additional project items are retained in an overflow rail. */
export function HeroOrbit({ content: c, id = 'home' }: { content: HeroContent; id?: string }) {
    const clickAnimations = useRef(new Set<Animation>());
    useEffect(() => () => { clickAnimations.current.forEach(a => a.cancel()); clickAnimations.current.clear() }, []);
    const uid = useId().replace(/:/g, ''); const [active, setActive] = useState(0); const section = useRef<HTMLElement>(null), orbit = useRef<HTMLDivElement>(null), readout = useRef<HTMLDivElement>(null);
    usePanelMotion(readout, active);
    useEffect(() => {
        const el = section.current!, scene = orbit.current!; let frame = 0;
        const media = matchMedia('(prefers-reduced-motion: reduce)'), fine = matchMedia('(pointer: fine) and (min-width: 961px)');
        const reset = () => { cancelAnimationFrame(frame); scene.style.removeProperty('--orbit-x'); scene.style.removeProperty('--orbit-y') };
        const move = (e: PointerEvent) => { if (media.matches || !fine.matches || e.pointerType === 'touch' || document.hidden) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const r = el.getBoundingClientRect(); scene.style.setProperty('--orbit-x', `${((e.clientX - r.left) / r.width - .5) * 10}px`); scene.style.setProperty('--orbit-y', `${((e.clientY - r.top) / r.height - .5) * 6}px`) }); };
        el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset); media.addEventListener('change', reset); document.addEventListener('visibilitychange', reset);
        return () => { reset(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); media.removeEventListener('change', reset); document.removeEventListener('visibilitychange', reset) };
    }, []);
    const node = c.agents[Math.min(active, c.agents.length - 1)];
    if (!node) throw new Error('HeroOrbit requires existing project agent content.');
    const names = ['agent-sales', 'agent-care', 'agent-flow', 'agent-human'];
    const button = (n: typeof node, k: number) => <button key={n.id} type="button" className={'agent-node ' + (names[k] ?? 'agent-extra') + (active === k ? ' is-active' : '')} aria-pressed={active === k} onClick={e => { setActive(k); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { const a = e.currentTarget.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); clickAnimations.current.add(a); a.onfinish = () => clickAnimations.current.delete(a) } }} data-agent={n.id}><span className="agent-icon"><Icon name={n.icon} /></span><span><strong>{n.title}</strong><small>{n.subtitle}</small></span></button>;
    return <MotionScope><section className="hero dark-surface" ref={section} id={id} aria-labelledby={uid + '-heading'} data-pc="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="page-width hero-layout"><div className="hero-copy">
            <p className="kicker hero-kicker">{c.eyebrow}</p>
            <h1 id={uid + '-heading'}>{c.heading}{c.mutedHeading && <><br /><span>{c.mutedHeading}</span></>}</h1><p className="hero-lead">{c.description}</p><div className="button-row"><ActionLink action={c.primary} className="btn btn-white" /><ActionLink action={c.secondary} className="btn btn-outline-light" icon="arrow" /></div></div>
            <div className="orbit-scene" ref={orbit} aria-label={c.sceneLabel}><div className="orbital-glow" aria-hidden="true" />
                <svg className="orbit-art" viewBox="0 0 640 640" aria-hidden="true"><defs><radialGradient id={uid + '-shine'}><stop stopColor="white" stopOpacity=".22" /><stop offset="1" stopColor="white" stopOpacity="0" /></radialGradient></defs><circle cx="320" cy="320" r="300" fill={`url(#${uid}-shine)`} /><g fill="none" stroke="white"><circle cx="320" cy="320" r="100" opacity=".25" /><circle cx="320" cy="320" r="151" opacity=".22" /><circle cx="320" cy="320" r="201" opacity=".18" /><circle cx="320" cy="320" r="252" opacity=".18" strokeDasharray="3 9" /><circle cx="320" cy="320" r="301" opacity=".14" /><path d="M0 320h640M320 0v640" opacity=".12" /></g><g className="orbit-satellites"><circle cx="320" cy="119" r="4.5" fill="white" /><circle cx="494" cy="421" r="3.5" fill="white" opacity=".85" /><circle cx="101" cy="194" r="3.5" fill="white" opacity=".7" /></g><g className="orbit-trace" fill="none" stroke="white" strokeWidth="1.5" opacity=".45"><circle cx="320" cy="320" r="151" strokeDasharray="70 879" /></g></svg>
                <div className="orbit-core" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 6 88 28v44L50 94 12 72V28L50 6Z" /><path d="M50 25 72 38v25L50 76 28 63V38L50 25ZM12 28l38 22 38-22M50 50v44" /></svg><span>{c.coreLabel}</span></div>
                <div className="orbit-cards-system" aria-label="Orbiting agent capabilities">
                    <div className="orbit-cards-rotor">
                        {c.agents.slice(0, 4).map((n, k) => (
                            <div key={n.id} className={`orbit-slot orbit-slot-${k}`}>
                                <div className="orbit-card-counter">
                                    {button(n, k)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="agent-readout" ref={readout} aria-live="polite"><span className="kicker">{c.workflowLabel}</span><p>{node.description}</p><span className="readout-index">{numberLabel(active + 1)} / {numberLabel(c.agents.length)}</span></div></div></div>
        {c.agents.length > 4 && <div className="page-width pc-extra-nodes">{c.agents.slice(4).map((n, k) => button(n, k + 4))}</div>}
        {/* <div className="page-width hero-bottom"><span className="kicker">{c.bottomLabel}</span><div>{c.bottomItems.map((s, k) => <span key={k}>{s}</span>)}</div><ActionLink action={c.scrollAction} icon="arrow" /></div> */}
    </section></MotionScope>;
}
