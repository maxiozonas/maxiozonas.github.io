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
- `public/images/atmosphere-{light,dark}.webp`: 1440 × 900 captures of the actual Light Rays shader, used for mobile, reduced motion, no JavaScript and unavailable/lost WebGL. With the site running, regenerate using `node scripts/capture-atmosphere.mjs` (or set `PORTFOLIO_URL`). These contain only the background, not page content.
- `public/cv-maximo-ozonas-{es,en}.pdf`: verified CV documents retained from the original portfolio.

## Design and motion

Cabinet Grotesk is self-hosted. The lime m/o identity is shared by the navbar and favicon. The hero is a typographic cover: Máximo Ozonas fills one line on desktop and two on mobile, with an accent-coloured surname. The role and location sit above it; a short introduction and actions sit below. `HeroTitle` borrows React Bits Text Pressure's pointer-proximity idea, using restrained vertical letter transforms rather than changing fonts or loading a variable font. GSAP animates the two words on entry and handles pointer response without React state updates or an idle animation loop. Pointer effects are local to the heading, reset on leave/blur and disable for touch, small screens and live reduced-motion changes. Real HTML preserves the name without JavaScript. No photo, constellation or hero canvas is rendered. GitHub and LinkedIn remain explicit labelled links.

Surfaces are neutral zinc (off-white in light mode, near-black in dark mode) with a single emerald accent defined by the `--p-*` values at the top of `src/styles/global.css`. The accent drives actions, links, the Light Rays, the card glow and the monogram, and the static atmosphere images are recoloured with a CSS hue filter. Theme selection persists locally and initially follows system preference. A segmented ES/EN selector keeps the corresponding project route and saves the language preference.

`Atmosphere.tsx` uses one lazily loaded React Bits Light Rays background in both themes. Diagonal blue/lime light enters from the top-right, with slow continuous movement and mouse steering/shadow. Intro, click pulses and pulsation are disabled. Rendering is capped at 30fps and DPR 1 and pauses when hidden or outside the viewport. There is no grid, ASCII, fluid cursor or Dot Grid. Theme updates preserve the canvas/context. Mobile, coarse pointers and reduced motion use CSS-selected static WebP captures instead of creating WebGL; no-JavaScript views get the same background through server-rendered markup. Loading, shader failure and context loss reveal the static image. There are no permission prompts, external fonts, scripts or new dependencies. Ghost Fibers and Splash Cursor sources remain unused. Scroll interactions are unchanged.

`ExperienceChapters.astro` presents Gili and Xenova as two full-width editorial chapters, not rounded cards or a chronological timeline. A normal-flow heading introduces the section; company identity, role, original dates and technologies sit beside a large summary, description and two open scope columns. Both roles retain their current status and verified content. Chapters are transparent, revealing the shared Light Rays atmosphere without another canvas or an independent background. Desktop Scroll Stack combines a restrained 0.96 scale with an outgoing fade, finishing before the next chapter's text can overlap. A small desktop handoff gap preserves a fully readable stop before the fade. Its bounds are measured on ScrollTrigger refresh, not on every animation frame. Scrolling back restores the previous chapter. Sticky positioning and spacing activate only after the animation is ready; no-JavaScript, tablet, mobile and reduced-motion views use ordinary document flow with all content visible. Live reduced-motion changes restore opacity, visibility and transforms. There is no pinned sidebar, Spotlight Card, border or shadow. Original logo files are unchanged: CSS clips only Xenova's transparent margins and presents both wordmarks in monochrome in light mode for legibility; dark mode retains their original colours.

`ProjectIndex` replaces the homepage's Magic Bento grid with six compact name/category links and one visible preview, without row dividers or decorative arrows. Project names are native anchors: click/Enter navigates to the case and browser modifier-click behaviour is preserved, including without JavaScript. Desktop previews change on mouse hover or keyboard focus; hovering cannot hide a panel whose links contain keyboard focus. On mobile, a separate text-only native summary opens/closes the inline preview without navigating. The summary and case link are siblings, never nested interactive controls. Named `details` keep previews mutually exclusive, including without JavaScript. Food Partners retains its real application-area overview; the other projects show complete responsive website captures, without nested device frames. Summaries, case links, public site links and Xenova affiliation remain available. Technology stacks stay on the detail routes rather than being repeated on every homepage row. Preview entrances respect reduced motion. The unused Magic Bento and constellation sources are retained, not rendered.

The hero and navigation together occupy the initial viewport. Its minimum height uses dynamic viewport units minus the navigation's existing occupied space (90px desktop, 86px mobile). A three-row grid keeps the name in the centre and actions near the bottom, while allowing content to grow on short screens rather than clipping it.

Detail pages include functionality, architecture and decisions verified against source repositories. The profile includes a five-stage working process, from understanding the operation to support in production, shown as full-width cards that stack over each other while scrolling (sticky cards and a GSAP scale on the card being covered). Each card carries a believable mini interface (`src/components/work-visuals.tsx`): a prioritised board, a named architecture diagram, a code editor with passing tests, a deployment log and a monitoring dashboard. Their entrance plays when the card reaches the viewport; below 1024px the cards are ordinary blocks, and with reduced motion every visual is shown in its final state. Six folders adapted from React Bits Folder Float group the real technology marks by language, web/backend, mobile, data, infrastructure and tools. Category colours and peeking logos identify each folder. Hover, click or keyboard activation opens one at a time; marks emerge with a short staggered animation and remain stable for selection. Each selected technology links to reviewed work. The mobile layout uses two columns and touch activation, with native disclosure controls and reduced-motion support. Education and languages have dedicated panels with the supplied UTN logo and explicit Native/B1 levels.

Folder Float provides the technology folders' opening motion, with stable CSS positions instead of continuous physics. The working-process cards, their illustrations and verified case associations are authored for this portfolio. The technology carousel and brain network are removed. Reduced motion disables transitions, and no new dependencies are required. Component provenance and upstream licensing are documented in `src/components/reactbits/README.md` and `LICENSE.md`.

`ProjectDevices` presents the public websites in CSS browser and phone frames on detail pages, retaining the complete screenshots without cropping the hero. The space around the device frames is transparent so the composition sits directly on its parent surface. On small screens, the detail views stack vertically. Case studies have a full-width heading, deliverables, explicit personal contributions, readable architecture rows and a plain text section index with a selected-link underline. Food Partners retains its text overview instead of application screenshots.

Detail pages list their complete documented stack with small local technology logos and readable labels. Detail headings, showcases, case sections and next-project links share a 1160px content container. The delivery and next-project panels use the same responsive inner padding.

Native View Transitions connect project images and titles across documents. GSAP handles entrances, reveals and desktop chapter scaling; CSS handles chapter sticking. Motion respects `prefers-reduced-motion`; WebGL fallbacks retain the static site.

The existing GitHub Pages workflow deploys on a push to its configured branch. Local development does not publish the site.
