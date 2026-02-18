# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tables London — a promotional single-page website built with Vue 3 + Vite. Full-screen video background, responsive design, GSAP animations. Deployed on Netlify.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `/dist`
- `npm run preview` — Preview production build locally

No test runner or linter is configured.

## Architecture

- **Framework:** Vue 3 with Composition API (`<script setup>`), JavaScript (no TypeScript)
- **Build:** Vite 5 with `@vitejs/plugin-vue`
- **State:** Pinia is installed but not currently used; state is local to components
- **Animation:** GSAP for content fade-in on mount
- **Styling:** Scoped CSS in Vue SFCs + global CSS variables in `src/assets/main.css`
- **Fonts:** Cormorant Garamond (brand serif), Inter (UI sans-serif) — loaded via Google Fonts in `index.html`
- **Path alias:** `@/` maps to `./src/` (configured in both `vite.config.js` and `jsconfig.json`)

## Key Files

- `src/App.vue` — The entire app lives here: header, video background, about text, contact section
- `src/assets/main.css` — Global styles, dark theme (`rgb(14, 13, 13)` background)
- `public/_redirects` — Netlify SPA routing config
- `public/assets/` — Static assets: logos (SVG), images (WebP), videos (MP4 for desktop and mobile)

## Responsive Design

- Breakpoint at **768px** separates mobile/desktop layouts
- Video source switches between desktop and mobile MP4 files based on viewport width
- Layout shifts from column (mobile) to row (desktop) using flexbox

## Deployment

Hosted on Netlify. `npm run build` produces the `/dist` directory. SPA routing handled by `public/_redirects`.
