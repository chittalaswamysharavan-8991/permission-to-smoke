# Product Requirements Document — Permission to Smoke v1.0

## Problem

Smoking urges often become action before a deliberate decision occurs. Existing trackers frequently focus on streaks, shame, or retrospective counting rather than the moment of choice.

## User and job

An adult smoker who wants to reduce or understand smoking needs a private, low-friction interruption when an urge appears, so the decision becomes conscious rather than automatic.

## Value proposition

One calm pause, honest data, no account, no judgement.

## In scope

1. Start an urge in one tap.
2. Record intensity, trigger, and optional note.
3. Run a configurable 1–60 minute pause with a breathing cue.
4. Record `skipped` or `smoked` without moral scoring.
5. Show today’s target progress, history, seven-day patterns, and protected-spend estimate.
6. Store all data locally; export, import, and reset it.
7. Work as an installable offline PWA on modern mobile and desktop browsers.
8. Provide accessibility, reduced-motion, privacy, and safety messaging.

## Non-goals

- Medical diagnosis, treatment, medication advice, or claims of cessation effectiveness
- Social feed, leaderboards, rewards, shame, or public streaks
- Accounts, cloud sync, notifications, location, microphone, camera, or third-party analytics
- Purchases, tobacco promotion, brand recommendations, or age verification
- Native App Store distribution in v1

## Acceptance criteria

- A user can complete urge → pause → decision in one session.
- Timer state survives a page refresh because end time is persisted.
- Both outcomes appear in history and update today/insight totals.
- Invalid numeric settings are bounded; text input is sanitized.
- Exported JSON can be imported back without losing valid records.
- Reset requires confirmation and removes local data.
- App shell loads after one successful online load when offline.
- Keyboard focus is visible, controls are labelled, and reduced-motion is respected.
- No request is made for account, analytics, camera, microphone, geolocation, or external data.
- Production build and automated domain tests pass.

## Risks

- Browser storage may be cleared by the user or operating system.
- Background timers are throttled; the app calculates from an absolute end timestamp rather than relying on interval accuracy.
- Insights are self-reported and must not be interpreted as clinical outcomes.
- Service worker updates can temporarily serve a cached old version; versioned cache cleanup mitigates this.

## Release definition

v1.0 is releasable only when product, build, source, Vercel exact-SHA deployment, Notion documentation, and independent audit gates all pass.
