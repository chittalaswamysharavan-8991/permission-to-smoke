# Build & Quality Report — Permission to Smoke v1.0.0

## Commands executed

- `node --check src/app.js`
- `node --check src/domain.mjs`
- `npm install --package-lock-only --ignore-scripts --offline`
- `npm test`
- `npm run build`
- Local HTTP checks against `/`, manifest, service worker, JavaScript, CSS, icon, and build metadata

## Results

- Automated domain tests: **5/5 passed**
- Production build: **PASS**; static bundle generated in `dist/`
- Package audit: **0 known vulnerabilities** (dependency-free runtime)
- Static endpoint checks: **7/7 returned HTTP 200**
- JavaScript syntax checks: **PASS**
- Secret-pattern scan: pending final repository pass

## Coverage map

- Session start and input sanitization
- Bounded intensity, delay, targets, baseline, and cost settings
- Skipped/smoked outcomes and persisted absolute timer end
- Today totals, target remainder, seven-day series, protected-spend estimate
- Malformed storage normalization, JSON export/import, active-session cancellation
- PWA manifest, cache service worker, icons, mobile/desktop responsive rules
- Local-only persistence, reset confirmation, safety disclaimer
- Semantic form controls, visible focus, reduced-motion support

## Browser/device evidence

Headless Chromium was available, but screenshot navigation did not terminate within the execution environment and was stopped. This is recorded as **not run**, not passed. Live interaction must be checked on the Vercel URL and an iPhone before release approval.

## Security and privacy

- No account, backend, analytics, advertisements, third-party runtime dependencies, camera, microphone, location, or external API
- CSP, referrer policy, permissions policy, MIME protection, and frame-ancestor denial configured for Vercel
- User text is length-limited and strips angle brackets before persistence/rendering
- `.gitignore` excludes environment files, dependencies, generated output, caches, logs, and Vercel state

## Known limitations

- No multi-device sync
- Browser/OS may clear local storage
- Background timer display may be throttled; absolute end timestamps preserve logical correctness
- Older iOS versions may handle SVG home-screen icons inconsistently
- Production deployment, GitHub CI, and live-device checks remain separate release gates
