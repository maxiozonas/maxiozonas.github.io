# Portfolio redesign

## Objective
Replace the command-gated terminal portfolio with an immediately readable bilingual portfolio aligned with the updated one-page CVs. Give Gili and Food Partners the strongest emphasis, and showcase four authentic public client websites.

## Problem and rationale
The terminal hides experience and projects behind commands. The existing project data misses Catalejo Travel and Quinta Pata, and underrepresents the fishery ERP and current Gili responsibilities.

## Authorized scope and constraints
- Local implementation only. No push, deployment, PR, merge, SSH, or unrelated repositories.
- Preserve Astro, bilingual /es/ and /en/ routes, static HTML, SEO, and working locale/theme preferences.
- Xenova-inspired palette: #07090d / #0b0e12 with #dcff71 as the primary accent. No generic glow or terminal-first layout.
- Use authentic screenshots from the supplied public URLs. Private Gili/Food Partners cases use honest descriptive process content, not invented screenshots or metrics.
- Publish both existing verified one-page CVs as local public assets. Never change the original CV.
- Preserve evidence: Food Partners is ongoing across sectors, HR is not claimed fully deployed; employee self-service is a PWA; Quinta Pata is healthcare affiliation/QR credentials, not delivered payments or plan management; Catalejo uses inquiries, not completed online bookings.
- No invented testimonials, proficiency bars, team size, business metrics, or deployment claims.
- Artifact language: professional neutral Spanish for /es/, English for /en/, English code and documentation.

## Design and delivery
Initial generated references covered hero, projects, experience, contact. User rejected the agency-like centered slogan, square/flat language, and Xenova-like layout. The palette alone should reference Xenova. Revised direction is a personal developer portfolio: prominent name and Full Stack Developer role, softer geometry, meaningful project exploration, and a regular two-column project gallery.
The supplied navbar reference has a detached brand capsule on the left and a rounded floating navigation capsule on the right. Translate that composition, not its documentation labels or GitHub star count. Preserve a usable mobile navigation and 44px control targets.
Seed 239 originally selected centered hero and asymmetric bento; the explicit user revisions override those selections. Keep Cabinet Grotesk, purposeful GSAP and static access. New hero and projects references precede this revised implementation.
Delivery strategy: single-pr, because this is one coherent replacement of the shared bilingual presentation, not independently deployable partial interfaces. A PR is not authorized and will not be opened. Approximate authored change forecast: 2,500 lines, including removal of terminal implementation; 400-line task guidance is advisory, not a requirement to split a coherent replacement.
RDD: disabled globally, observed before implementation. Do not enable or start native review. Ordinary verification remains required.

## Tasks
- [ ] T1 Implement the bilingual redesign, verified experience/client data, self-hosted typography, GSAP enhancement, authentic screenshots and both CV downloads.
  - Route: delegated direct. Trigger: reading prepares writing and multiple non-trivial source files.
  - Checks: meaningful deterministic Node regressions RED before implementation where runnable; npm run test; npm run check; npm run build; inspect generated ES/EN HTML and public assets.
  - Commit: pending.
- [ ] T2 Independently verify and refine the final local candidate, then record actual checks and commit boundaries.
  - Route: delegated direct. Trigger: independent browser/runtime verification after small-model writer and unknown/high risk fallback.
  - Checks: desktop and mobile, ES/EN, both themes, keyboard, no-JS fallback, reduced motion, no horizontal overflow, real links/CV assets, console errors. Lighthouse when tooling is available; report unavailable checks honestly.
  - Commit: pending.

## Acceptance criteria
Both locales show all primary experience without typing commands. The first viewport identifies Maximo Ozonas as a developer, not an agency. Gili and Food Partners are prominent. All four clients have real screenshots and correct public links in an orderly two-column desktop / one-column mobile gallery. The supplied detached rounded navbar composition is implemented. Project exploration has useful keyboard-accessible interaction. Professional copy matches verified CV evidence. Both CV downloads work. Controls are keyboard-accessible and visible. No-JS content remains readable. Animations respect reduced motion and never obstruct access. No horizontal clipping at 390px or desktop heading over two lines. No external publication occurs.

## Progress and recovery
- Branch point: 3b55131. Initial uncommitted candidate was paused after live user review.
- Initial candidate: npm run test 5/5 and npm run build passed; npm run check exposed a Vite root/nested type mismatch. Vite was aligned in the allowed package files; current npm run check passes with zero diagnostics.
- RED was observed before implementation: the old candidate lacked the revised personal-name hero and featured-project controls/details. The mobile-menu/title/favicon regression checks then failed 4/8 before correction (two locale titles still used a dash, the menu lacked anchor handling, and the favicon was absent). Corrected tests now pass 8/8.
- Follow-up correction: internal navigation anchors close the mobile details panel after native hash navigation and focus the destination section; desktop navigation remains open. Verified mouse and keyboard activation at 390px and 320px in both locales, with hash navigation preserved and focus outside the closed panel.
- Current exact-viewport Chromium captures: revised-hero-desktop.png (1366x768), revised-hero-mobile.png (390x844), and revised-projects-desktop.png (1366x1500) under C:/Users/GILI-IT/Projects/portfolio-assets. CDP measured document width at 390 for a 390px viewport in ES and EN; the mobile menu controls stayed within bounds. Carousel next/keyboard navigation and native project details toggled as expected. Parent verification still owns broader accessibility, theme, and reduced-motion review.
- The stale preview process returned 404 for /@vite/client. It was stopped through its known session and restarted with the same loopback-only Astro command. The current preview returns 200 for /es/, /en/, and /@vite/client with no observed browser exceptions. Current listener PID 25856; worker exec session 12204. No public deployment or repository commit was made.
- Base restores an inline SVG text-monogram favicon and uses a vertical-bar page-title separator. CDP observed /@vite/client 200, no /favicon.ico request, and no uncaught browser exceptions.
- The audit has 15 advisories (1 low, 4 moderate, 9 high, 1 critical); the independent verifier confirmed the same package identities and counts at branch point 3b55131. Treat as pre-existing; no audit fix or forced upgrade was applied.
- User revisions: Xenova colors only, not Xenova composition; softer non-square language; more meaningful interaction; clearly personal developer hero; ordered gallery; supplied detached rounded navbar reference.
- Screenshots verified under C:/Users/GILI-IT/Projects/portfolio-assets, outside repository; do not copy browser profiles.
- Engram mirror pending: authoritative runtime session identity is unavailable. Agent-attributed memory writes stopped by runtime instruction; local document is recovery source.
- Correction checks: npm run test 8/8; npm run check 0 errors/warnings/hints; npm run build passed; git diff --check passed with line-ending warnings only. Broader Lighthouse and axe remain unavailable per verifier report.
- T1 source implementation and correction self-checks are ready for parent readback. T1/T2 remain unchecked and uncommitted pending parent authorization; no commit or publication was made.
- Next step: parent structurally inspect and authorize the bounded local work-unit commit. Preview remains local at http://127.0.0.1:4321/es/.

## Relevant files
src/components/Portfolio.astro, src/components/Controls.astro, src/layouts/Base.astro, src/data/content.ts, src/styles/global.css, public/projects/, public/fonts/, public/cv-maximo-ozonas-{es,en}.pdf, package.json, package-lock.json, tests/portfolio.test.mjs.
