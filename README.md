# TierValues

A TierMaker-style interactive tier list for ranking 58 personal values — and an experiment in building a full app with Claude agent teams.

**Live demo:** [joelmgallant.github.io/tiervalues](https://joelmgallant.github.io/tiervalues/)

## What is this?

This started as a personal values exercise and turned into a playground for testing [Claude Code](https://docs.anthropic.com/en/docs/claude-code) agent teams. The entire app — from architecture to drag-and-drop to AI-generated icons — was built collaboratively with parallel Claude agents coordinating through shared task lists.

The actual app lets you drag and drop 58 personal values between S/A/B/C/D/F tiers, customize everything, and export your ranking as a PNG.

## Features

- Drag-and-drop values between tiers with smooth animations
- Add, remove, rename, and reorder tier rows
- Customize tier colors from a preset palette
- Top picks highlighted with a gold ring
- Export your tier list as a PNG image
- State persists to localStorage — pick up where you left off
- Fully client-side, no server required

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/) for drag-and-drop
- [Zustand](https://zustand.docs.pmnd.rs/) for state management
- [html2canvas-pro](https://github.com/nicolo-ribaudo/html2canvas-pro) for PNG export
- Value icons generated with [FLUX.1 schnell](https://fal.ai/) via fal.ai

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/tiervalues](http://localhost:3000/tiervalues) to view locally.

## Build

```bash
npm run build
```

Produces a static export in `out/` ready for deployment.

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via the included GitHub Actions workflow.

## License

MIT
