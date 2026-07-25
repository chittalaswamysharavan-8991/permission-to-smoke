# Build & Quality Report — Permission to Smoke v1.0.1

## Remediation scope

This corrective release addresses four independently confirmed issues:

1. The pause-screen decision button inherited white text on a white background.
2. `scripts/build.mjs` used a URL pathname that failed on Windows drive-letter paths.
3. A second urge could overwrite an already active pause after navigating away.
4. Imported or restored state accepted unsafe settings and invalid session timestamps.

## Commands executed

- `node --check src/app.js`
- `node --check src/domain.mjs`
- `npm test`
- `npm run build`

## Results

- Automated regression tests: **12/12 passed**
- Production build: **PASS**; static bundle generated in `dist/`
- JavaScript syntax checks: **PASS**
- Runtime dependencies: **0**
- CI now runs tests and builds on both `ubuntu-latest` and `windows-latest`

## Regression coverage

- Pause decision CTA retains readable foreground/background contrast.
- Active pauses cannot be overwritten by a second session start.
- Home provides a visible path back to an active pause.
- Imported numeric settings are bounded or reverted to safe defaults.
- Imported currency values are allow-listed and escaped at the DOM sink.
- Invalid active-session timestamps are discarded instead of freezing the timer.
- Invalid completed sessions are filtered from imported state.
- Build root resolution uses `fileURLToPath()` and is exercised during the test suite.

## Browser verification status

The local execution environment blocked Chromium navigation through an administrator policy. Local rendered-browser proof is therefore **not claimed** from this environment. The narrow production verification must be performed against the Git-connected Vercel deployment.

## Remaining release gates

- GitHub branch checks on Linux and Windows
- Git-connected Vercel production deployment
- Narrow live verification of the four remediated behaviors
