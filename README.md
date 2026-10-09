# Máximo Ozonas portfolio

Bilingual personal portfolio built with Astro, React islands, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), React Bits and GSAP. Static HTML preserves content and project navigation without JavaScript, including individual project pages. The interactive navigation hydrates on load, and the project effects hydrate when visible.

## Local development

Use Node.js 22.19 or newer; this workspace uses Node.js 24.

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open [Spanish](http://127.0.0.1:4321/es/) or [English](http://127.0.0.1:4321/en/). The root selects a language using the saved preference or browser language.

```sh
npm run check
npm test
npm run test:browser
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
```

Browser checks use the installed Chrome on Windows. Set `CHROME_PATH` to use a different executable; on other platforms, install the Playwright Chromium browser. Set `PORTFOLIO_URL` to test a production preview, for example `http://127.0.0.1:4322`. Screenshots, axe results and browser traces are saved under the ignored `artifacts/` folder.

## Content and assets

- `src/data/content.ts`: profile, CV-based experience and verified client project scope in both languages.
- `src/pages/[locale]/projects/[slug].astro`: eight static case-study routes with individual canonical URLs, translated language links and return navigation.
- `public/projects/`: genuine browser screenshots of Catalejo Travel, Quinta Pata, Inspira Ingeniería and Madryn Buceo, captured on 2026-10-09. PNG originals are retained alongside responsive WebP variants.
- `public/cv-maximo-ozonas-{es,en}.pdf`: the current verified CV documents from the local `Projects/cv-maximo-ozonas` folder.
- `public/images/systems-study.webp`: an abstract supporting visual generated with the built-in image-generation tool. It is decorative and is never presented as project work. Generation details are in `scripts/image-assets.json`.

Refresh project screenshots and optimize them with `npm run capture:projects`. The capture script retains the existing screenshot if a public site is unavailable. The output records capture dates and status in `artifacts/project-captures.json`.

## Design and motion

The design uses Xenova's verified palette: black `#0b0b0b`, off-white `#f6f6f6`, lime `#dcff71`, and secondary blue `#014fff`. Cabinet Grotesk is self-hosted. Semantic Tailwind tokens provide both themes; the initial theme follows the operating system, and a manual choice persists locally. Navigation and buttons are pills, project cards have a 24px radius, and screenshots use a 12px radius. Whitespace separates sections.

The full-width typographic hero uses React Bits Split Text. The project gallery adapts Magic Bento to a dense four-case grid with real screenshots, lime spotlight and mild perspective. Scroll Reveal and Magnet are adapted with scoped event cleanup and reduced-motion support. Component sources, modifications and the upstream MIT + Commons Clause license are documented in `src/components/reactbits/README.md`.

Experience precedes projects. Its two roles use a document-scrolling adaptation of Scroll Stack, retaining native expandable responsibilities. Larger Tailwind type tokens increase reading sizes across the page. Bento screenshot frames have consistent height, aligned footers and a permanent lime border in dark mode.

Ghost Fibers provides the animated WebGL background; Splash Cursor adds a lime fluid trail on fine-pointer devices. Both use actual React Bits shader sources. A pause control stops the visual effects, motion preferences are respected, and the cursor stops its RAF after five idle seconds. Splash Cursor loads lazily; contexts and listeners are released on unmount. Browser/graphics environments without WebGL retain the complete static portfolio.

The floating navigation combines shadcn NavigationMenu with a project preview menu and Sheet for mobile, plus circular hover choreography inspired by React Bits Pill Nav. Buttons and technology badges also use actual shadcn components installed via its CLI. Configuration is in `components.json`.

Native [View Transitions](https://docs.astro.build/en/guides/view-transitions/) connect project images and titles across documents, with ordinary navigation as fallback. GSAP handles entrance motion, section reveals and a pinned experience introduction on large screens. The technology band has a pause control. All motion respects `prefers-reduced-motion`.

Deployment remains the existing GitHub Pages workflow. A push to the configured deployment branch builds the static site; local development does not publish it.
