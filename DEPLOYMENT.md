# PropheC AI - Deployment & CI/CD Architecture

## 1. Target Architecture & Ownership

| Component | Target Identifier | Description |
| :--- | :--- | :--- |
| **Source Repository** | `govindgautam-glitch/prophec` | GitHub repository containing versioned source code |
| **GitHub Account** | `govindgautam-glitch` | Repository owner |
| **Production Branch** | `main` | Protected release branch |
| **CI Engine** | GitHub Actions | Automated lint, typecheck, production build, and smoke test |
| **Deployment Target** | Vercel | Production hosting platform |
| **Target Vercel Account** | `govindgautam-5554` | Vercel scope |
| **Target Vercel Project** | `prophec` | Production project name |
| **Deployment Model** | Vercel Native Git Integration | Automated Preview on PRs, Production on `main` merge |

---

## 2. Build & Runtime Specifications

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Runtime Environment:** Node.js 20.x or 22.x LTS
- **Package Manager:** `npm` (reproducible installs via `package-lock.json`)
- **Root Directory:** `./`
- **Output Directory:** Default Next.js (`.next`)

### Pipeline Commands
```bash
# Clean reproducible dependency install
npm ci

# ESLint validation (flat config eslint.config.mjs)
npm run lint

# TypeScript static analysis without emitting files
npm run typecheck

# Optimized production Next.js build
npm run build

# Cross-platform automated smoke validation
npm run test:smoke
```

---

## 3. Environment Variables Audit

- **Application Environment Requirements:** None.
- **Audit Findings:** Exhaustive scan of `src/` revealed 0 references to `process.env`. The application is entirely static and pre-rendered at build time.
- **Client Exposure:** Zero `NEXT_PUBLIC_` secrets or credentials exist in the source code.

---

## 4. Application Authentication Audit

- **Classification:** Public marketing and enterprise solutions presentation site.
- **Application Authentication:** **None.**
  - No login, signup, user account, or profile components exist.
  - No authentication SDKs (`next-auth`, `@supabase/auth-helpers`, `clerk`, etc.) are installed.
  - No server route handlers (`src/app/api/`), proxy middleware (`middleware.ts`), or server actions exist.
  - All inquiry interactions (such as "Discuss your project" and "Request Argus Access") are handled via client-side presentation dialogs ([`src/components/ActionModals.tsx`](./src/components/ActionModals.tsx)).
- **Vercel Deployment Protection:** Optional hosting-layer password/SSO protection can be toggled in Vercel project settings for preview deployments without impacting application code.

---

## 5. CI Pipeline (`.github/workflows/ci.yml`)

- **Triggers:**
  - `push` to `main`
  - `pull_request` targeting `main`
- **Concurrency:** Automatically cancels superseded runs on the same branch.
- **Security & Permissions:** Least-privilege `permissions: contents: read`.
- **Action Pinning:** All actions are pinned to immutable commit SHAs with semantic version comments.
- **Validation Gates:**
  1. `npm ci` with npm cache enabled.
  2. `npm run lint` (ESLint 9).
  3. `npm run typecheck` (`tsc --noEmit`).
  4. `npm run build` (`next build`).
  5. `npm run test:smoke` (probes pre-rendered route and verifies brand assets, layout anchors, and required/prohibited content blocks).

---

## 6. Vercel Linking & Release Setup

### First-Time Project Link in Vercel
1. Log in to Vercel with account `govindgautam-5554`.
2. Navigate to [Add New Project](https://vercel.com/new).
3. Select GitHub account `govindgautam-glitch` and choose repository `prophec`.
4. Configure Project Settings:
   - **Project Name:** `prophec`
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm ci`
5. Click **Deploy**. Vercel will build commit `main` and assign the production domain (`prophec.vercel.app` or custom domain).

### Ongoing Workflow
- Developers create a feature or fix branch and open a Pull Request against `main`.
- GitHub Actions runs CI validation (`.github/workflows/ci.yml`).
- Vercel automatically deploys a Preview deployment and comments on the PR.
- Once CI passes and PR is merged into `main`, Vercel automatically promotes the release to Production.

---

## 7. Rollback Procedure

If a critical regression is verified on a production release:

### Method A: Instant Vercel Rollback (Recommended)
1. Go to the [Vercel Dashboard](https://vercel.com) -> Project `prophec` -> **Deployments**.
2. Locate the previous healthy deployment (e.g., initial verified release commit `4ae5938`).
3. Click the three dots `...` on that deployment card.
4. Select **Promote to Production** (or **Instant Rollback**).
5. Vercel will instantly route production traffic back to the selected healthy build.

### Method B: Git Revert Rollback
1. Checkout `main` and pull latest:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Revert the problematic commit:
   ```bash
   git revert <REGRESSION_COMMIT_SHA> -m 1
   ```
3. Push to `main`:
   ```bash
   git push origin main
   ```
4. GitHub Actions CI validates the revert, and Vercel automatically redeploys.
