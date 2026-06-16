# maxiozonas.github.io

Personal portfolio of **Máximo Ozonas** — Development Lead & Full Stack Developer.

An interactive, terminal-style portfolio you can drive by typing or clicking commands
(`help`, `about`, `experience`, `projects`, `skills`, `github`, `contact`, …).
Responses print right inside the terminal, like a real CLI session.

🔗 **Live:** https://maxiozonas.github.io

## Features

- 🖥️ Terminal-first UI — clickable commands, no command-line knowledge required
- 🌗 Light / dark theme (dark by default), persisted across visits
- 🌐 Bilingual (English / Spanish) with automatic language detection
- 📊 Live GitHub contribution graph (token-less public API)
- ⌨️ Command history (↑/↓), autocomplete (Tab), and a few easter eggs
- ♿ SEO + no-JS fallback, respects `prefers-reduced-motion`

## Stack

[Astro](https://astro.build) · TypeScript · [Tailwind CSS](https://tailwindcss.com) · deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

Deployment is automated: every push to `main` builds and publishes via GitHub Actions.
