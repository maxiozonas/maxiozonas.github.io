# React Bits adaptations

Source: [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits), retrieved 2026-10-09. The upstream MIT + Commons Clause license is retained in `LICENSE.md`.

- `MagicBento.tsx`: derived from `src/ts-default/Components/MagicBento/MagicBento.tsx`. Preserves pointer-relative light and GSAP perspective behavior. Replaces demo data with four portfolio cases and responsive screenshots. Removes particles, click ripples, document-wide spotlight and hard-coded violet styles; uses scoped listeners, `quickTo`, cleanup and reduced-motion media queries.
- `SplitText.tsx`: upstream `src/ts-default/TextAnimations/SplitText/SplitText.tsx`, with a reduced-motion guard and ARIA correction for span tags. The hero provides an unsplit accessible heading. Uses GSAP SplitText and `@gsap/react`.
- `ScrollReveal.tsx`: derived from `src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx`. Preserves scrubbed word opacity, fixes nested heading/paragraph markup, adds accessible text and only reverts its own GSAP context. Removes blur.
- `Magnet.tsx`: derived from `src/ts-default/Animations/Magnet/Magnet.tsx`. Preserves pointer attraction with GSAP refs rather than per-frame React state; listens only within the button wrapper.
- `GhostFibers.tsx` and CSS: upstream `src/ts-default/Backgrounds/GhostFibers/`, with a neutral black shader backdrop and a WebGL availability guard. Runs at 30fps, pauses offscreen or when the document is hidden, supports a static reduced-motion frame and uses Xenova's lime palette.
- `SplashCursor.tsx`: upstream `src/ts-default/Animations/SplashCursor/SplashCursor.tsx`. Keeps the actual WebGL fluid simulation. Adds event/RAF/context cleanup, visibility handling, a five-second idle stop and a WebGL availability guard. It loads lazily on fine-pointer devices, follows motion preferences and uses fixed lime rather than rainbow colors.
- `ScrollStack.tsx`: adapts the stacking composition from `src/ts-default/Components/ScrollStack/ScrollStack.tsx` to document scrolling, CSS sticky positioning and GSAP scale scrubbing. Avoids the original nested scroll container and Lenis smoothing engine. Tall cards can scroll fully before sticking.
- `../PortfolioNav.tsx`: borrows Pill Nav's expanding circular hover fill. The navigation itself uses genuine shadcn Base UI NavigationMenu and Sheet, rather than the React Bits demo's router dependency and manual mobile overlay.

Brand tokens are defined centrally in `src/styles/global.css`. The six technology folders have their own muted category colours, while the rest of the site retains its lime identity.

- `SpotlightCard.tsx` and CSS: upstream `src/ts-default/Components/SpotlightCard/`, used inside the experience timeline. The portfolio overrides surfaces with semantic theme tokens, disables press flares and lowers light intensity. The WebKit mask assignment uses `setProperty` for compatibility without deprecated DOM types.

The hero is a minimal typographic introduction with a gentle word entrance. Technology marks sit in six interactive coloured folders. The hero has no monogram or abstract imagery. Decorative dividers, counters and underlined action links are omitted. Light mode uses mineral-white surfaces and olive text accents, without the WebGL background or fluid cursor. Dark mode retains both visual effects and the original lime identity.

- `AnimatedContent.tsx`: adapted from `src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx`. Keeps GSAP/ScrollTrigger entrance motion, renders visible static HTML, scopes cleanup to its media context and honours live reduced-motion changes.
- `FolderFloat.tsx` and CSS: adapted from `src/ts-default/Micro/FolderFloat/`. Preserves the folder silhouette, perspective flap and staggered spring reveal. Extends text items to real technology marks, replaces the physics engine and continuous drift with stable CSS positions, and uses named native `details` for exclusive opening with keyboard, touch and static HTML support. A click after hovering keeps the folder open; Escape closes it and restores focus. Peek papers show two logos, selecting a mark reveals verified work links, and reduced motion removes transitions.
- `../WorkMap.tsx`: the five-sector process wheel remains custom SVG, centred on a real problem. It is independent of the technology folders.
