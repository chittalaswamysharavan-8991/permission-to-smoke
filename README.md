# Permission to Smoke

A privacy-first progressive web app that interrupts an automatic smoking impulse with a deliberate pause.

## Product principle

The app never grants approval to smoke and never uses shame. It asks the user to notice the urge, wait, and then honestly record whether they skipped or smoked.

## Features

- Fast urge check-in: intensity, trigger, optional note
- Configurable pause timer with breathing cue
- Honest outcome logging: **Skipped** or **Smoked**
- Daily target, recent history, seven-day insights
- Potential spend protected estimate
- Local-only storage, JSON export/import, full reset
- Installable and offline-capable PWA
- Responsive and reduced-motion support

## Run

No third-party packages are required.

```bash
npm test
npm run build
npm run serve
```

Open `http://localhost:4173`.

## Deploy

The repository is Vercel-ready. Vercel should use the project root as the output source; `npm run build` produces `dist/`. Set the Output Directory to `dist` if automatic detection does not.

## Data and privacy

All data is stored in the current browser using `localStorage`. There is no account, backend, analytics, advertising, microphone, camera, location access, or cloud sync.

## Safety disclaimer

This is a reflection and tracking tool. It is not medical advice, a diagnosis, or a smoking-cessation treatment. Users seeking treatment should consult a qualified healthcare professional or local cessation support.

## License

MIT
