'use client';

import React, { useId, useRef, useState } from 'react';
import type { ArgusContent } from './types';
import './ArgusWorkflow.css';

/* SVG Connection Paths from the 4 channel nodes to central ARGUS chip */
const CONNECTION_PATHS = [
  'M 175 105 Q 240 105 255 155', // Node 1: WhatsApp (top-left) -> Core
  'M 425 105 Q 360 105 345 155', // Node 2: Email (top-right) -> Core
  'M 175 295 Q 240 295 255 245', // Node 3: CRM (bottom-left) -> Core
  'M 425 295 Q 360 295 345 245', // Node 4: Accounting / ERP (bottom-right) -> Core
];

/* Channel Icons */
const ChannelIcons = {
  whatsapp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  email: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  crm: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
    </svg>
  ),
  accounting: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="15" height="12" rx="2" />
      <path d="M5 21h9M10 16v5" />
      <rect x="16" y="10" width="6" height="11" rx="1.5" />
    </svg>
  ),
};

/* 5 Suite Module Icons exactly matching the reference image */
const SuiteIcons = [
  // 1: WhatsApp
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="argus-card-icon" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  // 2: Ready-Made AI Agents (Portrait user)
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="argus-card-icon" aria-hidden="true">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  ),
  // 3: Agent Factory (3D isometric cube)
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="argus-card-icon" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // 4: Workflow Automation (Cog / Gear)
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="argus-card-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  // 5: Enterprise Governance (Shield)
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="argus-card-icon" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
];

export function ArgusWorkflow({ content: c, id = 'argus' }: { content: ArgusContent; id?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const i = Math.min(selectedIndex, c.systems.length - 1);
  const activeSystem = c.systems[i] || c.systems[0];

  const nodeClasses = [
    'argus-node-whatsapp',
    'argus-node-email',
    'argus-node-crm',
    'argus-node-accounting',
  ];

  return (
    <section id={id} className="argus-wrapper" data-pc="argus" aria-labelledby={`${uid}-heading`}>
      {/* Atmosphere elements */}
      <div className="argus-bg-grid" aria-hidden="true" />
      <div className="argus-bg-glow-top" aria-hidden="true" />
      <div className="argus-bg-glow-mid" aria-hidden="true" />

      <div className="argus-container">
        {/* =================================================================
           1. TOP HEADER (Image 1 Parity: Centered Eyebrow, Heading, 2-Col Copy, CTA)
           ================================================================= */}
        <div className="argus-header">
          <span className="argus-eyebrow">
            {c.eyebrow || 'INTRODUCING ARGUS BY PROPHEC LABS'}
          </span>

          <h2 id={`${uid}-heading`} className="argus-heading display-heading">
            AI that runs the work
            <br />
            behind your business.
          </h2>

          <div className="argus-intro-grid">
            <p className="argus-intro-col">
              Businesses run across WhatsApp, email, CRM, accounting tools, and internal workflows but when these systems don&apos;t work together, enquiries get missed, information gets repeated, and everyday processes slow down.
            </p>
            <p className="argus-intro-col">
              Argus is an intelligent AI workflow automation platform designed to connect these touchpoints, manage customer interactions and follow-ups, and help execute workflows with human oversight and auditability.
            </p>
          </div>

          <div className="argus-intro">
            <button
              type="button"
              className="argus-cta-btn btn"
              onClick={c.action.onClick}
              aria-label="Request Argus Access"
            >
              <span>Request Argus Access</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12L12 4M12 4H6M12 4V10" />
              </svg>
            </button>
          </div>
        </div>

        {/* =================================================================
           2. UNIFIED INTERACTIVE WORKFLOW EXPERIENCE CARD
           ================================================================= */}
        <div className="argus-experience-card argus-experience">
          {/* LEFT: Interactive Connected Map */}
          <div className="argus-map-zone integration-map">
            <span className="argus-map-kicker map-caption">
              {c.mapLabel || 'EXPLORE A CONNECTED WORKFLOW'}
            </span>

            {/* Visual Interactive Canvas */}
            <div className="argus-map-canvas">
              {/* Curved Glowing Connection Lines */}
              <svg className="argus-svg-lines integration-lines" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                {CONNECTION_PATHS.map((d, k) => (
                  <path
                    key={k}
                    className={`argus-path integration-path${i === k ? ' is-active' : ''}`}
                    d={d}
                  />
                ))}
              </svg>

              {/* Central ARGUS Core Chip */}
              <div className="argus-core-node argus-core">
                <div className="argus-core-halo" aria-hidden="true" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="argus-core-icon icon" aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="3" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                  <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
                </svg>
                <strong className="argus-core-name">{c.coreName || 'ARGUS'}</strong>
                <span className="argus-core-sub">{c.coreDescription || 'Core Intelligence'}</span>
              </div>

              {/* 4 Interactive Channel Nodes */}
              {c.systems.slice(0, 4).map((s, k) => {
                const isActive = i === k;
                const IconComponent =
                  s.id === 'whatsapp'
                    ? ChannelIcons.whatsapp
                    : s.id === 'email'
                    ? ChannelIcons.email
                    : s.id === 'crm'
                    ? ChannelIcons.crm
                    : ChannelIcons.accounting;

                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`argus-channel-btn system-node ${nodeClasses[k]} ${isActive ? 'is-active' : ''}`}
                    aria-pressed={isActive}
                    aria-controls={`${uid}-workflow`}
                    aria-label={`${s.label} Integration`}
                    onClick={() => setSelectedIndex(k)}
                  >
                    <IconComponent />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footnote */}
            <div className="argus-map-footnote map-footnote">
              <span>{c.mapHint || 'Select anywhere to follow the flow.'}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>

          {/* RIGHT: Live Workflow Preview */}
          <div ref={panelRef} id={`${uid}-workflow`} className="argus-preview-zone workflow-panel" aria-live="polite">
            <div>
              <div className="argus-preview-top workflow-top">
                <span className="argus-preview-kicker kicker">
                  {c.workflowLabel || 'WORKFLOW PREVIEW'}
                </span>
                <span className="argus-preview-badge preview-tag">
                  INTEGRATION: {activeSystem.label.toUpperCase()}
                </span>
              </div>

              <h3 className="argus-preview-title">{activeSystem.title}</h3>
              <p className="argus-preview-desc">{activeSystem.description}</p>

              <ol className="argus-steps-list workflow-steps">
                {activeSystem.steps.map((stepText, k) => (
                  <li key={k} className="argus-step-item">
                    <span className="argus-step-num">{String(k + 1).padStart(2, '0')}</span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="argus-governance governance-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>{c.governance || 'Human oversight and audit approvals where it matters.'}</span>
            </div>
          </div>
        </div>

        {/* =================================================================
           3. FLOATING BANNER PILL (Central Tagline)
           ================================================================= */}
        <div className="argus-floating-pill-wrap">
          <div className="argus-floating-pill">
            {c.tagline || 'Every inquiry was answered. Every process was watched.'}
          </div>
        </div>

        {/* =================================================================
           4. THE ARGUS AUTOMATION SUITE (5 Modular Glass Cards)
           ================================================================= */}
        <div className="argus-suite-head">
          <div className="argus-suite-pill">
            <span className="argus-suite-dot" aria-hidden="true" />
            <span>THE ARGUS AUTOMATION SUITE</span>
          </div>

          <h3 className="argus-suite-title">
            From repetitive work to intelligent workflows.
          </h3>

          <p className="argus-suite-desc">
            Bring customer conversations, specialised AI agents, and business process automation into one connected system, designed to reduce manual effort while keeping people in control.
          </p>
        </div>

        <div className="argus-cards-grid argus-modules">
          {c.modules.map((m, k) => {
            const ModuleIcon = SuiteIcons[k] || SuiteIcons[0];
            return (
              <article key={m.id} className="argus-module-card">
                <ModuleIcon />
                <span className="argus-card-kicker kicker">
                  MODULE / {String(k + 1).padStart(2, '0')}
                </span>
                <h3 className="argus-card-title">{m.title}</h3>
                <p className="argus-card-desc">{m.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
