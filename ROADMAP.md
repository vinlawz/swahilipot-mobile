# Swahilipot Mobile — Roadmap & Knowledge Base

The official mobile app for **Swahilipot Hub Foundation** (Mombasa, Kenya) — combining
the **Foundation** (community, youth, and tech hub) and **Swahilipot FM** (live radio)
into one app.

- Website: https://swahilipot.org
- Contact: info@swahilipot.org
- Location: Mombasa, Kenya
- FM live stream: `swahilipotfm.out.airtime.pro` (Airtime Pro)

---

## Current state of the app

A React Native / Expo app built with **Expo Router** (file-based routing) and
**expo-audio**. Bottom tab navigation with 6 tabs.

| Tab | What it does | Status |
|-----|--------------|--------|
| **Home** | Responsive launcher grid (1–4 cols by width), logo, org contact info | ✅ Built |
| **FM** | Live radio player — Play / Pause / Stop, LIVE badge, connecting states | ✅ Working |
| **Foundation** | Programs / Get Involved | 🟡 Placeholder |
| **Socials** | Updates / Groups feed | 🟡 Placeholder |
| **Events** | Upcoming / Past highlights | 🟡 Placeholder |
| **Profile** | Account / Settings | 🟡 Placeholder |

**Standout feature — background FM streaming:**
- React Context `PlayerProvider` wraps the whole app (`components/AudioPlayer.tsx`)
- `shouldPlayInBackground: true` + `playsInSilentMode` → audio keeps playing across
  tabs and when the app is backgrounded
- A **floating mini-player** (`components/FloatingPlayer.tsx`) appears above the tab
  bar on every screen once playback starts

The working, real part is: **the navigation shell + the live FM radio engine.**
The Foundation / Socials / Events / Profile tabs are scaffolding awaiting real content.

---

## Roadmap

### Phase 1 — Account & Platform (priority)
1. **Auth & Profiles** — sign up / login; make the Profile tab real (name, email,
   membership status, avatar). Recommended backend: **Supabase** (free tier, Postgres
   + auth + storage, strong Expo fit) — Firebase is the alternative.
2. **Backend / CMS** — move Foundation programs, Events, and FM show schedules out of
   hardcoded content so the team can edit without redeploying (Supabase tables or a
   headless CMS).
3. **Push notifications** — `expo-notifications`: "FM show starting now," event
   reminders, new opportunities.
4. **Offline support** — cache content + remember last FM state, so the app opens
   gracefully with poor/no signal (common on the coast).
5. **Analytics** — FM listenership numbers + screen engagement (helps the Foundation
   report impact to funders).

### Phase 2 — Swahilipot FM
- Show schedule / "what's on now & next"
- Now-playing song metadata + song history
- Podcasts / on-demand replays
- Sleep timer
- Song requests & shoutouts

### Phase 3 — Foundation / Hub
- Programs directory, membership, volunteering
- Mentorship & youth upskilling
- Hub space / room booking
- Opportunities board (jobs, gigs, calls)

### Phase 4 — Events & Community
- Event calendar with RSVP / tickets
- Social feed & announcements
- Member directory

---

## Tech stack
- Expo (~54) + React Native (0.81) + React 19
- Expo Router (~6) — file-based routing in `app/`
- expo-audio — FM streaming
- TypeScript

## Running locally
```bash
npm install
npm run start   # then press a (Android), i (iOS), or w (web)
```
