# Swahilipot Mobile

The official mobile app for **Swahilipot Hub Foundation** (Mombasa, Kenya) —
the Foundation hub and **Swahilipot FM** live radio in one app.

Built with Expo Router + expo-audio. Features a 6-tab shell and live FM streaming
that keeps playing in the background, with a floating mini-player.

## Getting started
```bash
npm install
npm run start   # press a (Android), i (iOS), or w (web)
```

## Project layout
- `app/` — file-based routes (Expo Router); tabs live in `app/(tabs)/`
- `components/AudioPlayer.tsx` — FM streaming engine (React Context)
- `components/FloatingPlayer.tsx` — persistent mini-player
- `ROADMAP.md` — full feature roadmap & project knowledge base

See [ROADMAP.md](ROADMAP.md) for the plan and SwahiliPot background.
