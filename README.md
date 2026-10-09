# Máximo Ozonas portfolio

Bilingual personal portfolio built with Astro, React islands, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), React Bits and GSAP. Static HTML preserves the content, project links and experience summaries without JavaScript.

## Local development

Use Node.js 22.19 or newer.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open [Spanish](http://127.0.0.1:4321/es/) or [English](http://127.0.0.1:4321/en/). The root selects a language using the saved preference or browser language.

```sh
npm run check
npm test
CHROME_PATH=/usr/bin/chromium npm run test:browser
npm run preview -- --host 127.0.0.1 --port 4322
```

Browser checks use the installed Chrome on Windows. On Linux, set `CHROME_PATH` to an installed browser or install Playwright Chromium. `PORTFOLIO_URL` can target a production preview. Screenshots, accessibility results and failure traces are saved under ignored `artifacts/`.

## Content and assets

- `src/data/content.ts`: profile, experience, project summaries and skills in both languages.
- `scripts/experience-content-sources.json`: Gili and XenovaDevs repository snapshots supporting the company contributions.
- `src/data/case-studies.ts`: project context, features, architecture, technical decisions and outcomes.
- `scripts/project-content-sources.json`: repository snapshots and files used to substantiate the cases. Implemented functionality is distinguished from public deployment; no outcome metrics are invented.
- `src/pages/[locale]/projects/[slug].astro`: eight static case-study routes with canonical URLs, translated links and return navigation.
- `public/projects/`: real public-site screenshots captured on 2026-10-09, with responsive WebP variants. Refresh using `npm run capture:projects`.
- `public/brand/`: generated m/o monogram and favicon sizes. Generator, prompt and derivatives are recorded in `scripts/brand-assets.json`.
- `public/technologies/`: local Devicon and Simple Icons technology marks and provenance.
- `public/education/utn.png`: UTN logo supplied by the user, preserved unchanged with transparent margins handled in CSS.
- `public/images/systems-study.webp`: generated decorative supporting image; not presented as client work.
- `public/cv-maximo-ozonas-{es,en}.pdf`: verified CV documents retained from the original portfolio.

## Design and motion

Cabinet Grotesk is self-hosted. The lime m/o identity is shared by the navbar and favicon. The minimal typographic hero introduces Máximo by name and role. GitHub and LinkedIn are explicit icon buttons. The hero has no monogram, project previews or decorative panels. Links use text labels without decorative arrows.

Light mode uses mineral white, white surfaces and olive accents. Dark mode uses off-black, lime and a subdued Ghost Fibers background. Theme selection persists locally and initially follows system preference. A segmented ES/EN selector keeps the corresponding project route and saves the language preference. Splash Cursor loads lazily for fine-pointer devices in dark mode.

Experience uses a timeline with React Bits Scroll Stack and Spotlight Card. Each company is identified once by its logo; the heading is the role. Each company has an ecosystem summary and two complementary scope paragraphs: the operational reach and the development responsibilities. These preserve substance without feature-by-feature lists or nested cards. Tall cards scroll fully before sticking. Projects retain the screenshot-based Magic Bento grid. Detail pages include functionality, architecture and decisions verified against source repositories. The profile includes an interactive five-stage working wheel centred on a real problem, from understanding the operation to support in production. A separate technology network groups the real marks by language, web/backend, mobile, data, infrastructure and tools. Selecting a technology highlights related nodes and links to reviewed work; two anatomical hemispheres and cortical folds make the network recognisable as a brain on desktop and mobile. Solid edges show actual technology relationships; dotted local trees indicate category membership, without a central hub. Education and languages have dedicated panels with the supplied UTN logo and explicit Native/B1 levels. Decorative dividers and section numbering are omitted; action links use rounded buttons without underlines.

React Bits Animated Content provides scroll entrances for both maps. The SVG branch highlight uses the path-reveal pattern from Branched Menu; topology, workflow wheel, real technology marks and case associations are authored for this portfolio. The technology carousel is removed. Connection signals pause offscreen or when hidden, and reduced motion disables them. No new dependencies are required. Component provenance and upstream licensing are documented in `src/components/reactbits/README.md` and `LICENSE.md`.

Native View Transitions connect project images and titles across documents. GSAP handles entrances, reveals and desktop experience pinning. Motion respects `prefers-reduced-motion`; WebGL fallbacks retain the static site.

The existing GitHub Pages workflow deploys on a push to its configured branch. Local development does not publish the site.
