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

- `src/data/content.ts`: profile, Gili and Xenova experience, project summaries, affiliation and skills in both languages. Roles use stable IDs for links and carry company logo metadata. The profile uses Tech Lead; Xenova uses Tech Lead · Developer and describes responsibilities across client projects and company products. Its start date awaits confirmation.
- `src/data/food-partners.ts`: featured industrial ERP project and bilingual case study, supported by the existing Food Partners repository review. A brief text preview explains production and traceability, quality and cold storage, and employee tools and monitoring. Application screenshots are omitted.
- `src/data/yogur-griego-rey.ts`: public catalogue and WhatsApp orders plus the sales, cash, consignment delivery, production, stock and finance modules verified in the XenovaDevs repository. Its screenshot shows the public website.
- `scripts/experience-content-sources.json`: Gili and XenovaDevs repository snapshots supporting the company contributions.
- `src/data/case-studies.ts`: project context, features, architecture, technical decisions and outcomes. `src/data/project-contributions.ts` describes the author's specific contribution to each project.
- `scripts/project-content-sources.json`: repository snapshots and files used to substantiate the cases. Implemented functionality is distinguished from public deployment; no outcome metrics are invented.
- `src/pages/[locale]/projects/[slug].astro`: twelve static case-study routes with canonical URLs, translated links and return navigation.
- `public/projects/`: actual desktop and mobile website screenshots with responsive WebP variants, refreshed on 2026-10-14. Desktop captures use 1440 × 900; mobile captures use a 390 × 844 viewport at 2× pixel density. Source URLs and capture metadata are recorded in `scripts/project-screenshot-sources.json`. Refresh all public sites using `npm run capture:projects`, or select a site with `node scripts/capture-projects.mjs madryn-buceo` followed by `node scripts/optimize-projects.mjs madryn-buceo`.
- `public/companies/xenova.png`: official lime Xenova logo downloaded from the company's website, retained in its original colours.
- `public/brand/`: generated m/o monogram and favicon sizes. Generator, prompt and derivatives are recorded in `scripts/brand-assets.json`.
- `public/technologies/`: local Devicon and Simple Icons technology marks and provenance.
- `public/education/utn.png`: UTN logo supplied by the user, preserved unchanged with transparent margins handled in CSS.
- `public/images/systems-study.webp`: generated decorative supporting image; not presented as client work.
- `public/cv-maximo-ozonas-{es,en}.pdf`: verified CV documents retained from the original portfolio.

## Design and motion

Cabinet Grotesk is self-hosted. The lime m/o identity is shared by the navbar and favicon. The hero presents Máximo and Ozonas on separate lines, with an accent-coloured surname, a short character blur reveal using React Bits SplitText and the Tech Lead role. React Bits Dot Grid adds a masked, pointer-responsive background on desktop with hover and normal motion. It follows the theme and keeps a static CSS fallback without JavaScript or WebGL. GitHub and LinkedIn are explicit icon buttons. Links use text labels without decorative arrows.

Light mode uses cool off-white, white surfaces, navy text and Xenova blue (#014fff) for actions, links and active states. Card effects follow the same theme tokens, and darker blue hover states preserve white-text contrast. The lime monogram keeps the shared identity. Dark mode uses off-black, lime and a subdued Ghost Fibers background. Theme selection persists locally and initially follows system preference. A segmented ES/EN selector keeps the corresponding project route and saves the language preference. Splash Cursor loads lazily for fine-pointer devices in dark mode.

Experience uses a timeline with React Bits Scroll Stack and Spotlight Card for Gili and Xenova. Both companies use their logos; the heading is the role. Each company has a summary and two complementary scope paragraphs. Tall cards scroll fully before sticking. All six projects use the same Magic Bento card. Food Partners spans the full grid width and has a short text preview of its application areas, shared with its detail page and next-project preview. The last card also spans the full width to complete the desktop grid. Other previews use responsive screenshots. Xenova projects, including Inspira and Yogur Griego Rey, show their affiliation on the homepage and detail pages. Detail pages include functionality, architecture and decisions verified against source repositories. The profile includes an interactive five-stage working wheel centred on a real problem, from understanding the operation to support in production. Six folders adapted from React Bits Folder Float group the real technology marks by language, web/backend, mobile, data, infrastructure and tools. Category colours and peeking logos identify each folder. Hover, click or keyboard activation opens one at a time; marks emerge with a short staggered animation and remain stable for selection. Each selected technology links to reviewed work. The mobile layout uses two columns and touch activation, with native disclosure controls and reduced-motion support. Education and languages have dedicated panels with the supplied UTN logo and explicit Native/B1 levels. Decorative dividers and section numbering are omitted; action links use rounded buttons without underlines.

React Bits Animated Content provides the working wheel's scroll entrance. Folder Float provides the technology folders' opening motion, with stable CSS positions instead of continuous physics. The wheel and verified case associations are authored for this portfolio. The technology carousel and brain network are removed. Reduced motion disables transitions, and no new dependencies are required. Component provenance and upstream licensing are documented in `src/components/reactbits/README.md` and `LICENSE.md`.

`ProjectDevices` presents the public websites in CSS browser and phone frames on project cards and detail pages, retaining the complete screenshots without cropping the hero. The space around the device frames is transparent so the composition sits directly on its parent surface. On small screens, the detail views stack vertically. Case studies have a full-width heading, deliverables, explicit personal contributions, readable architecture rows and a plain text section index with a selected-link underline. Food Partners retains its text overview instead of application screenshots.

Project cards list their complete documented stack with small local technology logos and readable labels. Detail headings, showcases, case sections and next-project links share a 1160px content container. The delivery and next-project panels use the same responsive inner padding.

Native View Transitions connect project images and titles across documents. GSAP handles entrances, reveals and desktop experience pinning. Motion respects `prefers-reduced-motion`; WebGL fallbacks retain the static site.

The existing GitHub Pages workflow deploys on a push to its configured branch. Local development does not publish the site.
