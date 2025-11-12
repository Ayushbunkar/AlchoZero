# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

# AlchoZero – Drunk Driving Detection (Frontend Only)

Frontend prototype for a MERN-style "Drunk / Drowsy Driving Detection & Safety System". This repository contains ONLY the React + Tailwind CSS client with mocked data streams (no real backend or hardware integration).

## Tech Stack
- Vite + React
- Tailwind CSS (dark neon theme)
- Framer Motion (animations)
- Axios (mock, prepared for future API)
- React Router DOM (routing)

## Features
- Simulated detection confidence updates every 5s
- Animated risk meter with dynamic color (green / yellow / red)
- High risk alert banner and toast notifications when confidence > 0.7
- Dashboard with camera preview (browser webcam), sensor cards, breathalyzer mock input, safety suggestions
- Device management (add/remove/activate mock devices)
- Event log (live + initial mock events, CSV export)
- Settings (user profile mock, threshold slider, notification toggle, emergency contact)

## Project Structure
See `/src` for organized folders: `components`, `contexts`, `hooks`, `pages`, `services`, `utils`.

## Running Locally

```powershell
npm install
npm run dev
```
Then open the local host URL printed in the terminal.

## Next Steps (Backend / Future)
- Replace mock socket/data with real WebSocket/REST endpoints
- Persist events and user settings in database
- Add authentication & role-based views (Fleet Admin, Driver)
- Implement actual sensor ingestion & ML inference pipeline

## Disclaimer
All data is simulated for demonstration. This does not perform real impairment detection.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
