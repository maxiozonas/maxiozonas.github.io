# React Bits adaptations

Source: [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits), retrieved 2026-10-09. The upstream MIT + Commons Clause license is retained in `LICENSE.md`.

- `MagicBento.tsx`: derived from `src/ts-default/Components/MagicBento/MagicBento.tsx`. Preserves pointer-relative light and GSAP perspective behavior. Replaces demo data with four portfolio cases and responsive screenshots. Removes particles, click ripples, document-wide spotlight and hard-coded violet styles; uses scoped listeners, `quickTo`, cleanup and reduced-motion media queries.
- `SplitText.tsx`: upstream `src/ts-default/TextAnimations/SplitText/SplitText.tsx`, with a reduced-motion guard and ARIA correction for span tags. The hero provides an unsplit accessible heading. Uses GSAP SplitText and `@gsap/react`.
- `ScrollReveal.tsx`: derived from `src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx`. Preserves scrubbed word opacity, fixes nested heading/paragraph markup, adds accessible text and only reverts its own GSAP context. Removes blur.
- `Magnet.tsx`: derived from `src/ts-default/Animations/Magnet/Magnet.tsx`. Preserves pointer attraction with GSAP refs rather than per-frame React state; listens only within the button wrapper.
- `GhostFibers.tsx` and CSS: upstream `src/ts-default/Backgrounds/GhostFibers/`, with a neutral black shader backdrop and a WebGL availability guard. Runs at 30fps, pauses offscreen or when the document is hidden, supports a static reduced-motion frame and uses Xenova's lime palette.
- `SplashCursor.tsx`: upstream `src/ts-default/Animations/SplashCursor/SplashCursor.tsx`. Keeps the actual WebGL fluid simulation. Adds event/RAF/context cleanup, visibility handling, a five-second idle stop and a WebGL availability guard. It loads lazily on fine-pointer devices, follows motion preferences and uses fixed lime rather than rainbow colors.
- `ScrollStack.tsx`: adapts the stacking composition from `src/ts-default/Components/ScrollStack/ScrollStack.tsx` to document scrolling, CSS sticky positioning and GSAP scale scrubbing. Avoids the original nested scroll container and Lenis smoothing engine. Open responsibilities release the first sticky card to preserve long-form reading.
- `../PortfolioNav.tsx`: borrows Pill Nav's expanding circular hover fill. The navigation itself uses genuine shadcn Base UI NavigationMenu and Sheet, rather than the React Bits demo's router dependency and manual mobile overlay.

Brand tokens are defined centrally in `src/styles/global.css`; Xenova's violet-free palette is used consistently.
