# Type Racer

A typing speed game built with React and TypeScript. Match the passage with live feedback, a precise timer, and a WPM score when you finish.

**Play it live:** [https://type-racer-game.vercel.app](https://type-racer-game.vercel.app) (hosted on Vercel.)

## Features

- **Modern UI** — Dark theme, glass-style card, DM Sans + JetBrains Mono, and subtle accent glow aligned with the in-app look.
- **Live character feedback** — Correct, incorrect, and “next character” highlighting as you type.
- **Accurate timing** — Centisecond timer updates while the round is active.
- **WPM** — Words per minute is shown when you complete a run (based on word count and elapsed time).
- **Countdown** — Five-second countdown before the input unlocks so you can settle in.
- **Auto-finish** — When your input exactly matches the full passage, the run ends immediately (no Enter key).
- **Multiple prompts** — Built-in passages; use **New prompt** to swap to another random text and reset the round state.
- **Race again** — After a finished run, start another attempt on the same passage (or pick a new prompt first).

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build   # Typecheck + production bundle
npm run preview # Serve the production build locally
npm run lint    # ESLint
```

## How to play

1. Click **Start race** and wait for the countdown.
2. Type the passage in the input field. Fix mistakes as you go; the display shows per-character status.
3. Finish by typing the **last character** correctly — the timer stops as soon as the full text matches.
4. Check your time and WPM, then **Race again** or **New prompt** for a fresh passage.

## Project layout

- `src/App.tsx` — Game logic, prompts, timers, and UI structure.
- `src/styles/App.css` — Component and theme styles.
- `src/styles/index.css` — Global base styles and font import.
- `public/favicon.svg` — Tab icon (passage lines + caret).

## Tech stack

- React 19
- TypeScript
- Vite 7
- ESLint (flat config)
