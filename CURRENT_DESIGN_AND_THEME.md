# PropheC AI — Complete Current Visual Design & Theme Specification

> **File:** `CURRENT_DESIGN_AND_THEME.md`  
> **Repository:** `govindgautam-glitch/prophec`  
> **Brand Identity:** PropheC AI — Beyond Digital. Into Intelligent.  
> **Tech Stack:** Next.js 16 (Turbopack) • React 19 • Tailwind CSS v4 • Matter.js • Lucide Icons  
> **Core Palette:** Strict Dual-Tone (Deep Green `#091c09` & Pure White `#ffffff`) + Warm Editorial Footer Canvas (`#F3F0EB`)

---

## 1. Master Color Palette & Design Tokens

PropheC AI uses an intentional **Bimodal Dual-Tone Architecture**. The interface alternates deliberately between deep, luminous immersion (Hero, Modals) and bright, crisp high-legibility editorial white surfaces (About, Ecosystem, Argus, Build).

### 1.1 Color Tokens Table

| Token Name | HEX / RGBA Value | Semantic Usage & Context |
| :--- | :--- | :--- |
| **Brand Deep Green** (`--brand-green`) | `#091c09` | Primary dark foundation, hero background, dark button backgrounds on white canvas, high-contrast dark typography. |
| **Brand Pure White** (`--brand-white`) | `#ffffff` | Primary light canvas background, elevated card surfaces, hero typography, white pill buttons. |
| **Warm Editorial Sand** | `#F3F0EB` | Specific architectural background for the large typographical editorial Footer. |
| **Editorial Charcoal** | `#202124` | Footer primary typography and divider lines (derived from Google Labs design language). |
| **Editorial Muted Grey**| `#5f6368` | Secondary navigation links and metadata inside the footer. |
| **Translucent Green High** | `rgba(9, 28, 9, 0.82)` | Glass card backgrounds on dark hero (`.figma-agent-card`) and modal backdrops. |
| **Translucent Green Nav** | `rgba(9, 28, 9, 0.78)` | Hero floating pill navbar (`.figma-glass-nav`). |
| **Translucent White Nav** | `rgba(255, 255, 255, 0.92)` | Sticky navbar background after scrolling past the hero (`.light-sticky-nav`). |
| **Hairline Border (Light)** | `rgba(9, 28, 9, 0.10)` | Card borders, section dividers, and pill outline button borders on white surfaces. |
| **Hairline Border (Dark)** | `rgba(255, 255, 255, 0.16)` | Borders on dark hero agent cards, concentric rings, and hero navbar. |
| **Muted Text (Dark on White)** | `rgba(9, 28, 9, 0.70)` | Secondary explanations, card descriptions, and meta tags on white canvas. |
| **Muted Text (White on Dark)** | `rgba(255, 255, 255, 0.75)` - `0.85` | Subtitles and badges inside the hero and dark modals. |
| **Subtle Surface Tint** | `rgba(9, 28, 9, 0.03)` - `0.04` | Inset diagram wells, icon containers, and chip pill backgrounds. |

---

## 2. Typography System

The application combines **Urbanist** (clean, authoritative modern sans-serif with geometric precision) with **Space Grotesk** (technical monospace feel for badges, chips, and data indicators).

### 2.1 Type Hierarchy Specification

| Level | Font Family | Desktop Size | Mobile Size | Weight | Tracking | Primary Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1 (Hero)** | Urbanist | `56px` | `30px - 42px` | 700 (Bold) | `-0.02em` | `#ffffff` |
| **Editorial Headline H2** | Urbanist | `56px - 66px` | `28px - 40px` | 800 (Extra Bold)| `-0.03em` | `#091c09` |
| **Section Title H2** | Urbanist | `36px - 48px` | `24px - 32px` | 800 (Extra Bold)| `-0.02em` | `#091c09` |
| **Card Heading H3** | Urbanist | `20px - 28px` | `18px - 22px` | 700 (Bold) | `-0.015em`| `#091c09` / `#ffffff` |
| **Lead Subheading** | Urbanist | `18px` | `14px - 16px` | 500 (Medium) | Normal | `rgba(255,255,255,0.85)` / `rgba(9,28,9,0.70)` |
| **Body Paragraph** | Urbanist | `14px - 16px` | `13px - 14px` | 500 (Medium) | Normal | `rgba(9, 28, 9, 0.70)` |
| **Telemetry / Chip / Badge** | Space Grotesk | `10px - 12px` | `10px - 11px` | 700 (Bold) | `+0.05em` | `#091c09` / `#ffffff` |
| **Oversized Footer Brand** | Urbanist | `clamp(3.2rem, 13vw, 14rem)` | `clamp(3.2rem, 13vw, 14rem)` | 700 (Bold) | `-0.04em` | `#202124` |

---

## 3. Global Navigation (`Navbar.tsx`)

A floating pill-shaped dynamic navigation bar pinned at `top-4` or `top-6`, transitioning smoothly based on the scroll position.

### 3.1 Visual Modes
1. **Hero Glass Mode (Scroll < 650px):**
   - **Background:** `rgba(9, 28, 9, 0.78)` with `backdrop-filter: blur(26px)`.
   - **Border:** `1.2px solid rgba(255, 255, 255, 0.16)`.
   - **Internal Bevel:** `inset 0 1px 1.5px rgba(255, 255, 255, 0.20)`.
   - **Drop Shadow:** `0 20px 40px -15px rgba(9, 28, 9, 0.60)`.
   - **Logo:** Pure white vector logo (`/brand/prophec-logo-v2.png`).
   - **Navigation Links:** White with 80% opacity (`text-white/80`), hovering to 100% white.
   - **Search Icon:** Round pill button in `rgba(255, 255, 255, 0.10)`.
   - **Primary Action Button:** Solid white pill button (`bg-white text-[#091c09]`) labeled *"Discuss your project ↗"*.

2. **Editorial Sticky Mode (Scroll ≥ 650px):**
   - **Background:** `rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(20px)`.
   - **Border:** `1px solid rgba(9, 28, 9, 0.10)`.
   - **Drop Shadow:** `0 10px 30px -10px rgba(9, 28, 9, 0.06)`.
   - **Logo:** Deep green vector logo (`/brand/prophec-logo-v2-dark.png`).
   - **Navigation Links:** Deep green with 80% opacity (`text-[#091c09]/80`).
   - **Primary Action Button:** Deep green pill button (`bg-[#091c09] text-white`).

### 3.2 Navigation Links
- `Solutions` (`#services`)
- `Argus` (`#argus`)
- `What We Build` (`#build`)
- `About` (`#about`)
- `Our Work` (`#work`)

---

## 4. Section-by-Section Visual Breakdown

```
┌────────────────────────────────────────────────────────────┐
│ 1. NAVBAR (Adaptive Glass Floating Pill)                   │
├────────────────────────────────────────────────────────────┤
│ 2. HERO: "Beyond Digital. Into Intelligent."               │
│    - Deep Green #091c09 Canvas                             │
│    - 6 Concentric Geometric Rings + Radial White Bloom     │
│    - 4 Floating Interactive Agent Glass Cards              │
│    - Dual Pill CTAs: "Discuss your project" & "Argus"     │
├────────────────────────────────────────────────────────────┤
│ 3. ABOUT: "Building the systems behind modern businesses."  │
│    - Pure White Canvas                                     │
│    - Scroll-linked kinetic word activation                 │
│    - Oversized ambient rotating geometry                   │
├────────────────────────────────────────────────────────────┤
│ 4. AI ECOSYSTEM: 3D Spatial Carousel                       │
│    - 6 Core Capabilities (Deck Page 5)                     │
│    - Authored SVG Vector diagrams per service              │
│    - Pagination controls & touch gesture support           │
├────────────────────────────────────────────────────────────┤
│ 5. WHAT WE BUILD & PRINCIPLES                              │
│    - 4 Build Pillars (Products, Systems, Ecosystems, UX)   │
│    - 6 Principles ("One partner. Every layer.")            │
│    - 7 Industry Sectors Interactive Explorer               │
│    - 8 Client Partner Marks ("Our Work")                   │
│    - 4 Leadership Executive Profile Cards                  │
├────────────────────────────────────────────────────────────┤
│ 6. ARGUS PLATFORM & AUTOMATION GAP                         │
│    - Interactive 4-Node Integration Diagram (WhatsApp,    │
│      Email, CRM, Accounting/ERP)                           │
│    - Dynamic SVG connector pulses                          │
│    - 5 Enterprise Capabilities (WhatsApp, Agents, Factory, │
│      Workflows, Governance)                                │
├────────────────────────────────────────────────────────────┤
│ 7. INTERACTIVE GEOMETRIC PLAYGROUND                        │
│    - 2D Matter.js Real-Time Physics Canvas                 │
│    - 5 Bouncing/Draggable Rigid Shapes (Deep Green & White)│
│    - Tactile "Shuffle" and "Reset" controls                │
├────────────────────────────────────────────────────────────┤
│ 8. EDITORIAL FOOTER                                        │
│    - Warm Editorial Sand #F3F0EB Foundation                │
│    - Giant Responsive "PropheC Ai" Typography Display      │
│    - 5-Column Responsive Sitemap & Support Modal Trigger   │
└────────────────────────────────────────────────────────────┘
```

---

### Section 1: Hero & Spatial Orbit (`Hero.tsx` & `HeroArtworkRings.tsx`)

* **Canvas Tone:** Deep Green `#091c09` with top gradient `linear-gradient(179.26deg, rgba(255, 255, 255, 0.08) 1.02%, #091c09 109.26%)`.
* **Atmospheric Centerpiece (`HeroArtworkRings`):**
  * `1220px × 1255px` vector graphic anchored behind the headline.
  * Central `700px` radial glow blur (`blur-[140px]`, `opacity-35`) casting an ethereal white light.
  * 6 concentric precision circles (radii: 140px, 230px, 320px, 410px, 500px, 590px) featuring dashed strokes, gradients, and 6 orbiting celestial satellites.
  * Fine crosshair axis lines (`x1=610`, `y1=627`) framing the central viewport.
  * Dynamic mouse parallax tracking (shifting `±10px` horizontally and `±6px` vertically).
* **Eyebrow Chip:** Rounded pill in `bg-white/10 backdrop-blur-md border border-white/20`, pulsing white dot, text: `"AI-Driven Technology & Digital Solutions"`.
* **Main Headline:** Urbanist Bold `56px` text: `"Beyond Digital. Into Intelligent."` in crisp pure white `#ffffff`.
* **Hero Lead Text:** 18px text in `rgba(255, 255, 255, 0.85)` with line height `1.35`.
* **Hero Call-to-Actions (Dual Pill Buttons):**
  * *Primary:* White background (`#ffffff`), Deep Green text (`#091c09`), height `50px`, pill radius `9999px`, white drop glow `0 4px 18px -2px rgba(255, 255, 255, 0.25)`, text: `"Discuss your project ↗"`.
  * *Secondary:* Transparent background, white border (`1.5px solid rgba(255,255,255,0.25)`), white text (`#ffffff`), text: `"Explore Argus →"`.
* **4 Floating Interactive Agent Cards (`.figma-agent-card`):**
  * Built with `rgba(9, 28, 9, 0.82)` glass, `backdrop-filter: blur(16px)`, border `1px solid rgba(255, 255, 255, 0.16)`.
  * Gentle organic hovering animations (`animate-drift-a` & `animate-drift-b`).
  * Click displacement: Clicking any card triggers a physical spring bump (`4-8px`).
  * **Card 1: Sales Agent** (Left, top: 249px) — Sparkles icon, subtitle: *"Pipeline Qualification"*.
  * **Card 2: Customer Care** (Left, top: 400px) — Headphones icon, subtitle: *"Support & Routing"*.
  * **Card 3: Workflow Automation** (Right, top: 222px) — Cpu icon, subtitle: *"Cross-System Execution"*.
  * **Card 4: Human Oversight** (Right, top: 386px) — ShieldCheck icon, subtitle: *"Audit & Approvals"*.

---

### Section 2: Editorial Introduction (`AboutStatement.tsx`)

* **Canvas Tone:** Pure White `#ffffff` with top hairline border `rgba(9, 28, 9, 0.10)`.
* **Background Atmosphere:** Oversized ambient geometric blobs with scroll-linked rotational parallax (`transform: translateY(...) rotate(...)`).
* **Kinetic Typography:**
  * Headline: *"Building the systems behind modern businesses."* (Urbanist Extra Bold `56px - 66px`).
  * Words are linked to scroll progress: as the user scrolls, words illuminate from muted `rgba(9, 28, 9, 0.28)` into high-contrast deep green `#091c09`.
* **Mission Copy:**
  * Primary paragraph (`24px` Urbanist SemiBold): *"PropheC is an AI-driven technology company helping startups, businesses, institutions, and organisations turn ideas into intelligent digital products and scalable technology ecosystems."*
  * Secondary paragraph (`18px` Urbanist Medium, border-top separated): Outlines capabilities across websites, mobile apps, AI tools, automation, dashboards, SaaS, CRM, and ERP.

---

### Section 3: AI Ecosystem Carousel (`ProjectCarousel.tsx`)

* **Canvas Tone:** Pure White `#ffffff`.
* **Header & Controls:**
  * Eyebrow: Monospace `"AI ECOSYSTEM"`.
  * Headline: `"Intelligent capabilities built for real operations."`
  * Pagination: Circular arrow buttons (`48px` diameter) with active hover scaling and step counter (`01 / 06`).
* **Interactive 3D Carousel Cards:**
  * Large elevated cards (`editorial-card`), `28px` border radius, subtle elevation shadow `0 4px 20px -2px rgba(9, 28, 9, 0.04)`.
  * Center card stands upright (`scale: 1`, `z-index: 20`); neighboring cards tilt subtly away with lower opacity to emphasize depth.
  * **Authored SVG Function Artwork:** Each card contains an authored architectural diagram:
    1. *AI Applications:* Modular interlocking geometric layers.
    2. *AI Agents:* Pulsing central decision hub with qualification telemetry.
    3. *AI Automation:* Closed-loop pipeline flow.
    4. *AI-Powered Analytics:* Architectural data bar chart with trend vector.
    5. *Intelligent Systems:* Core CPU engine interconnect.
    6. *Custom AI Solutions:* Polyhedral customized algorithm matrix.
  * Supports drag/swipe gestures on mobile and keyboard arrow controls.

---

### Section 4: What We Build, Principles & Proof (`WhatWeBuildSection.tsx`)

This section contains 5 distinct architectural content modules:

1. **What We Build (4 Editorial Grid Cards):**
   * *Digital Products:* Web apps, mobile apps, user-centered digital products. (Icon: `MonitorSmartphone`).
   * *Business Systems:* Custom CRM, ERP, and enterprise dashboards. (Icon: `Database`).
   * *AI Ecosystems:* AI agents, intelligent workflows, and automation. (Icon: `Workflow`).
   * *Product Design:* Intuitive UI/UX, user journeys, and design systems. (Icon: `Palette`).
   * Each card features a Deep Green icon box (`#091c09`), white icon, monospace badge chip, and bold Urbanist typography.

2. **One Partner, Every Layer (6 Core Principles):**
   * 3×2 grid of minimalist white cards with subtle hairline borders.
   * *Principles:* `End-to-End`, `AI Driven`, `Custom-Built`, `Scalable`, `Business-First`, `Future-Ready`.

3. **Who We Build For (7 Industry Sectors Interactive Explorer):**
   * Two-column split layout:
     * *Left:* Interactive selector list of 7 sectors: `Startups`, `Growing Businesses`, `Enterprises`, `Institutions`, `Jewellery`, `Hospitality`, `Real Estate`. Selected item turns solid deep green (`#091c09`) with white text.
     * *Right:* Large deep-dive card displaying sector-specific challenges, tailored architectural approaches, and checkmark badges (*Custom System Architecture*, *Full Interoperability*).

4. **Our Work (8 Client Marks):**
   * Minimalist, highly legible client monogram grid: `Hobnob Realtech`, `Innovher`, `Alliance for Political Intelligence`, `Bharat Ventures`, `Cityvibes`, `AllSoll`, `IDEA IND`, `FAIR Stay`.
   * Each tile displays a monogram badge, client company name, and industry sector subtitle.

5. **Leadership Team (4 Executive Profiles):**
   * Monogram avatar in deep green, executive name, corporate role, and affiliation:
     * `Aditya Mittal` — Manager, Growth & Partnerships (IDEA IND)
     * `Nikhil Kumar` — Chief Technical Officer (PROPHEC)
     * `Kartik Choudhary` — Head of Strategy & Intelligence (IDEA IND)
     * `Tanishka Patel` — Chief of Design & Experience (ALLSOLL)

---

### Section 5: The Argus Intelligence Layer (`ArgusSection.tsx`)

* **Canvas Tone:** Pure White `#ffffff`.
* **Section Eyebrow & Headline:**
  * Eyebrow: `ARGUS INTELLIGENCE LAYER` with CPU icon chip.
  * Headline: *"From repetitive work to intelligent workflows."*
  * CTA: Deep green pill button *"Request Argus Access ↗"*.
* **Interactive Central Node Architecture:**
  * **Central Node:** Pure white rounded square card (`128px × 128px`) with `2px solid #091c09`, labeled **Argus Core AI**.
  * **4 Satellite System Nodes:**
    1. *WhatsApp* (Direct Messaging)
    2. *Email* (Inbox Dispatch)
    3. *CRM* (Pipeline Sync)
    4. *Accounting / ERP* (Financial & Tally)
  * **Active Connection Pulses:** Dynamic SVG vector lines connect the central Argus node to the active satellite node with a thick solid green line (`#091c09`), while inactive connections remain subtle dashed hairlines.
  * **Live Workflow Preview Card:** Clicking any satellite node updates the right-hand panel, revealing the exact data flow and a checklist of 4 autonomous capabilities.
* **5 Automation Capability Cards:**
  * *WhatsApp Automation*, *Ready-Made AI Agents*, *Agent Factory*, *Workflow Automation*, *Enterprise Governance*.
  * Each card includes an icon, title, description, and status tag (`Module 0X • Verified`).

---

### Section 6: Interactive 2D Physics Scene (`InteractiveShapeScene.tsx`)

* **Inspiration:** Google Labs interactive experimental aesthetic.
* **Canvas Engine:** Matter.js 2D rigid-body physics engine embedded in an HTML5 canvas.
* **5 Tactile Rigid Bodies:**
  1. *Body 1:* Large Deep Green Circle (radius 110px, fill `#091c09`, stroke `rgba(255, 255, 255, 0.40)`).
  2. *Body 2:* Pure White Rounded Chamfered Rectangle (240px × 170px, fill `#ffffff`, stroke `#091c09`, 2px border).
  3. *Body 3:* Large Deep Green Circle (radius 115px, fill `#091c09`).
  4. *Body 4:* Pure White Capsule Pill (250px × 140px, fill `#ffffff`, stroke `#091c09`, 2px border).
  5. *Body 5:* Deep Green Accent Circle (radius 80px, fill `#091c09`).
* **Interactions:**
  * Full pointer drag-and-throw physics with restitution and gravity.
  * **Shuffle Shapes Button:** Applies upward and lateral kinetic force impulses to all shapes.
  * **Reset Position Button:** Returns all 5 bodies to an orderly, balanced resting layout.
  * Automatic pause when out of viewport or when `prefers-reduced-motion` is active.

---

### Section 7: Editorial Large Typographic Footer (`Footer.tsx`)

* **Canvas Foundation:** Warm Sand / Editorial Paper `#F3F0EB`.
* **Typography Palette:** Deep Charcoal `#202124` and Muted Slate `#5f6368`.
* **Layout Structure:**
  1. *Top Navigation Row:*
     * Label: *"Other teams and product areas"*
     * Links: `Prophec AI`, `Technology`, `Solutions`, `About Us`.
  2. *Monumental Brand Display:*
     * Headline: `"PropheC Ai"` rendered in ultra-large Urbanist Bold (`clamp(3.2rem, 13vw, 14rem)`).
     * Tight letter spacing (`-0.04em`) and line height (`0.84`), dominating 85%+ of screen width.
  3. *Divider Rule:* Thin 1px rule in `rgba(32, 33, 36, 0.20)`.
  4. *5-Column Semantic Navigation Grid:*
     * Col 1: Bold brand logo link (`Prophec AI`).
     * Col 2: `ABOUT PROPHEC AI`.
     * Col 3: `PRODUCTS & SOLUTIONS` + interactive `SUPPORT` button (opens the Audit Modal).
     * Col 4: `PRIVACY`.
     * Col 5: `TERMS` (right aligned on desktop).

---

### Section 8: Interactive Modals (`ActionModals.tsx`)

1. **Audit & Consultation Modal (`AuditModal`):**
   * Triggered by *"Discuss your project"*, *"Request Argus Access"*, and *"SUPPORT"*.
   * Backdrop: `rgba(9, 28, 9, 0.80)` with `backdrop-filter: blur(12px)`.
   * Container: Deep Green card (`#091c09`) with white hairline border (`border-white/15`).
   * Content: Calendar icon, title *"Book an AI Audit"*, email input, project requirements textarea, and submit button.
   * Confirmation state: Animated checkmark with instant confirmation message.

2. **Global Search Modal (`SearchModal`):**
   * Triggered by the search icon in the navigation bar.
   * Auto-filtering search input matching solutions, platform tools, and company documentation in real time.

---

## 5. Summary Cheat Sheet: Visual Styling Rules

| Visual Feature | Rule / Value |
| :--- | :--- |
| **Corner Radii** | Pill Buttons: `9999px` • Editorial Cards: `24px - 28px` • Icon Containers: `12px - 16px` • Diagram Nodes: `16px - 24px` |
| **Pill Buttons** | Height: `50px` (desktop), `46px` (mobile) • Padding: `0 1.75rem` • Font Weight: 700 Urbanist |
| **Hero CTAs** | Primary: Solid White `#ffffff` with `#091c09` text • Secondary: Outline White `1.5px` border with `#ffffff` text |
| **Editorial CTAs** | Primary: Solid Deep Green `#091c09` with `#ffffff` text • Secondary: Outline Green `1.5px` border |
| **Card Borders** | On White: `1px solid rgba(9, 28, 9, 0.10)` • On Dark: `1px solid rgba(255, 255, 255, 0.16)` |
| **Card Hover Effect** | `transform: translateY(-2px)` + soft diffuse shadow `0 20px 40px -12px rgba(9, 28, 9, 0.08)` |
| **Easing Motion** | `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-prophec`) |
| **WCAG Contrast** | Primary elements achieve **17.57 : 1** (exceeds AAA standards). Secondary copy achieves **5.5 : 1** (exceeds AA). |

---
*Generated directly from active production components in `/src/components` and `/src/app`.*
