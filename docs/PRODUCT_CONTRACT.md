# Product Contract — Permission to Smoke: Body Impact V1

**Product:** Permission to Smoke  
**Feature:** Body Impact  
**Contract version:** 1.0  
**Status:** SPEC_LOCKED for UX/UI design  
**Locked:** 2026-09-13  
**Factory verdict:** EXTEND EXISTING  
**Risk classification:** R4 — safety-sensitive health information  
**Primary platform:** Existing installable, offline-capable PWA  
**Primary audience:** Adults who smoke and want to understand exposure, reduction, and quitting without shame or false medical certainty

---

## 1. Product identity

Body Impact extends Permission to Smoke with an evidence-aware visual answer to one question:

> “What does smoking this many cigarettes per day mean for my body, and what changes if I reduce or stop?”

The feature must make smoking exposure understandable and emotionally meaningful while preserving the parent product principle: **never grant approval to smoke, never shame the user, and never pretend to diagnose them.**

Body Impact is an educational decision-support experience, not a medical prediction engine.

---

## 2. User problem

Cigarette counts such as 2, 5, 10, or 20 per day are abstract. A user may understand that smoking is harmful but still lack an intuitive picture of:

- which body systems are affected;
- why “only a few” cigarettes are not equivalent to no smoking;
- what reducing exposure means and does not mean;
- what recovery begins after stopping;
- which statements are established evidence versus population-level associations.

The product must turn those abstractions into a clear visual experience without inventing individual damage percentages, disease probabilities, or guaranteed recovery outcomes.

---

## 3. Primary outcome

After using Body Impact, the user can accurately understand their selected smoking level as an **exposure context**, see body systems affected by cigarette smoking, compare a lower daily amount with their current amount, and understand that reaching zero enables the strongest health benefit trajectory.

### V1 success condition

A user can complete the core exploration in under 60 seconds:

**Set cigarettes/day → inspect body impact → compare a lower target → inspect zero/recovery → open evidence for at least one claim.**

---

## 4. Product principles

### P1 — Evidence before drama
Visual impact may be emotionally strong, but every health statement must be supportable by an approved source.

### P2 — No fake precision
The app must never convert cigarettes/day into a personal “damage %,” “lung health %,” exact disease probability, biological age, or years-of-life-lost estimate unless a future clinically validated model explicitly supports that output.

### P3 — Exposure is not diagnosis
A selected cigarettes/day value describes an exposure pattern. It does not establish the user’s current organ condition.

### P4 — Lower is better; zero is the health target
The product may show that reduced exposure is directionally preferable to higher exposure, but must never label any non-zero cigarette level as safe.

### P5 — Recovery is hopeful, not guaranteed
Quitting/recovery information must be phrased as evidence-based population or physiological timelines, not as a guarantee that a specific user will recover on an exact schedule.

### P6 — No shame
No red failure states, moral scoring, guilt language, grotesque imagery, or fear-only messaging.

### P7 — Source transparency
A user must be able to identify why the app is making a health statement and where the supporting evidence came from.

### P8 — Privacy first
Body Impact inherits Permission to Smoke’s local-only privacy model. No account, analytics, advertising, tracking SDK, or cloud health profile is introduced in V1.

---

## 5. V1 scope

### Must Have

1. **Daily cigarette input**
   - Primary control accepts `0–40 cigarettes/day`.
   - Values are integers.
   - Direct numeric entry is available as an accessible alternative to the slider.
   - Input is clamped and validated; no negative, blank, NaN, or infinite states.

2. **Human-body impact view**
   - A clinically styled human-body visualization is the primary visual.
   - V1 body systems:
     - Heart & circulation
     - Lungs & airways
     - Mouth & throat
     - Brain / nicotine dependence context
     - Reproductive health
     - Whole-body / cancer context
   - System highlighting represents **relevance of established smoking effects**, not literal visible organ damage.

3. **Exposure context**
   - The selected cigarettes/day value updates the experience immediately.
   - The UI may use qualitative exposure bands for navigation and emphasis.
   - Qualitative bands must not be labelled as medical severity grades.
   - The product must display a persistent message that there is no proven safe level of cigarette smoking.

4. **Body-system evidence cards**
   - Tapping a body system opens a concise evidence card.
   - Each card contains:
     - what cigarette smoking is known to affect;
     - claim type;
     - evidence/source name;
     - source link;
     - population/interpretation caveat when applicable.

5. **Compare mode**
   - User can compare `Current cigarettes/day` with `Target cigarettes/day`.
   - Comparison can state that reducing exposure is directionally favorable.
   - It must not calculate an unsupported exact percentage reduction in personal disease risk.
   - Any non-zero target retains the “not safe” context.

6. **Zero / Recovery mode**
   - Selecting `0 cigarettes/day` changes the main experience from exposure mode to recovery mode.
   - Recovery mode shows an evidence-based cessation timeline.
   - V1 timeline anchors supported by CDC may include:
     - minutes: heart rate drops;
     - 24 hours: blood nicotine reaches zero;
     - several days: blood carbon monoxide falls to the level of someone who does not smoke;
     - 1–12 months: coughing and shortness of breath decrease;
     - 1–2 years: heart-attack risk drops sharply;
     - longer-term cardiovascular and cancer risk reductions.
   - If the user has not supplied a quit date/time, the timeline is clearly labelled **Generic recovery timeline**.
   - If a quit date/time is supplied locally, the app may position the user on the timeline, but must still avoid guaranteeing personal biological recovery.

7. **Evidence transparency**
   - Every quantitative health claim has a source.
   - Every population-risk statistic preserves the population/context in which it was observed.
   - Evidence metadata is stored separately from presentation copy so claims can be reviewed without rewriting UI code.

8. **Safety language**
   - Persistent concise disclaimer: educational information, not diagnosis or medical advice.
   - No language suggesting the app can inspect the user’s actual lungs, heart, blood vessels, cancer status, fertility, or other organ condition.
   - Concerning symptoms are outside Body Impact’s interpretation scope.

9. **Local-only persistence**
   - Saved current cigarettes/day, comparison target, optional quit date/time, and UI preferences remain local to the current browser.
   - No new backend or cloud profile is introduced.

10. **Accessibility and motion safety**
    - All visual body systems are reachable by keyboard and screen reader.
    - Color is never the only carrier of meaning.
    - Reduced-motion preference produces a fully usable static experience.
    - No flashing, pulsing, gore, or medically misleading organ animation.

### Should Have

1. Remember the user’s last current and target cigarette values locally.
2. Evidence detail drawer with source date and claim classification.
3. A simple `Why zero matters` summary that appears during comparison.
4. A body-system legend that explains visual intensity is illustrative, not diagnostic.
5. Shareable/exportable plain-text summary that contains no private history unless the user explicitly chooses it.
6. Optional `Quit date/time` input for recovery-position context.
7. Plain-language mode for users who do not want epidemiology terminology.

### Later

1. Pack-year or duration-aware educational context after collecting smoking duration explicitly.
2. Evidence-supported age/sex-specific context where a source genuinely supports it.
3. Integration with an authoritative smoking log only after completeness of cigarette capture can be proven.
4. Apple Health or other health-data context only under a separate privacy and clinical-risk review.
5. Telugu / Romanized Telugu educational copy.
6. Cessation-support resources localized by country.
7. Clinician-reviewed content pack.
8. Evidence-update workflow with structured source review and change log.

### Non-goals

Body Impact V1 will **not**:

- diagnose any disease or medical condition;
- predict what the user’s actual organs currently look like;
- generate a personal lung-damage, heart-damage, cancer-risk, fertility-risk, or life-expectancy percentage from cigarettes/day;
- claim that a particular non-zero cigarette count is safe;
- interpolate unsupported risk percentages between cigarette counts;
- prescribe nicotine replacement therapy, medication, or a cessation treatment plan;
- replace a clinician or medical evaluation;
- generate grotesque or fear-based body imagery;
- infer cigarettes/day from incomplete urge/outcome logs;
- upload smoking or health data to a backend;
- add accounts, social features, leaderboards, advertisements, or third-party analytics;
- use AI-generated medical claims at runtime.

---

## 6. Evidence model

### 6.1 Claim classes

Every displayed health claim must be assigned exactly one class.

**E1 — Established causal health effect**  
Use when authoritative sources state that cigarette smoking causes or contributes to a disease/body-system effect.

**E2 — Population association / risk statistic**  
Use for epidemiologic findings such as mortality or disease-risk comparisons. These claims must preserve cohort/population wording and may not be presented as an individual prediction.

**E3 — Cessation / recovery timeline**  
Use for evidence-backed changes after quitting. These are displayed as expected population/physiologic trajectories, not guarantees.

**E4 — Illustrative visualization**  
Used only for visual emphasis. E4 can never create a new health claim and must be labelled in the UI model as non-diagnostic.

### 6.2 Evidence record schema

Each evidence-backed content item must support at least:

```text
claim_id
body_system
claim_class
statement
exposure_context
population_context
source_organization
source_title
source_url
source_publication_or_review_date
reviewed_for_release_date
quantitative_value (optional)
quantitative_unit (optional)
interpretation_caveat
```

### 6.3 Evidence rules

1. Cigarettes/day alone must never be used to estimate the user’s current organ damage.
2. Numeric values are displayed only when a source explicitly supports that number and context.
3. The app must not linearly interpolate disease risk between two sourced cigarette counts.
4. A visual gradient may become stronger as cigarettes/day increases, but it represents **exposure emphasis**, not a measured damage scale.
5. Low-intensity smoking must not be presented as harmless. NCI evidence shows increased mortality risk even among people who consistently smoked at low intensity.
6. Reduction messaging must distinguish `reduced exposure` from `eliminated exposure`.
7. A cessation timeline begins only in zero/recovery mode.
8. If evidence is disputed, outdated, population-specific in a way that materially affects interpretation, or lacks sufficient provenance, omit the claim from V1.
9. Runtime AI must not invent, rewrite, or numerically extrapolate health claims.
10. Evidence content changes require review before release because the feature is R4 safety-sensitive.

### 6.4 Approved V1 source baseline

The initial evidence dataset may use claims from the following authoritative sources:

- CDC — Benefits of Quitting Smoking: https://www.cdc.gov/tobacco/about/benefits-of-quitting.html
- CDC — Cigarettes and Cardiovascular Disease: https://www.cdc.gov/tobacco/about/cigarettes-and-cardiovascular-disease.html
- U.S. Surgeon General / HHS — Tobacco Reports and Publications: https://www.hhs.gov/surgeongeneral/reports-and-publications/tobacco/index.html
- U.S. Surgeon General / HHS — Health Consequences of Smoking fact sheet: https://www.hhs.gov/surgeongeneral/reports-and-publications/tobacco/consequences-smoking-factsheet/index.html
- National Cancer Institute — No Safe Level of Smoking / Low-Intensity Smoking Risk: https://www.cancer.gov/news-events/press-releases/2016/low-intensity-smoking-risk

A source being on this list does not automatically authorize every possible claim from it; each displayed claim must still retain appropriate context.

---

## 7. P0 user journeys

### P0-J1 — Understand current exposure

**Starting condition**  
User opens Body Impact.

**User action**  
Sets current smoking to a value from 0–40 cigarettes/day.

**Application response**  
Body visualization updates, shows the selected exposure count, highlights relevant body systems, and presents non-diagnostic evidence summaries.

**Persisted/resulting state**  
Selected value is saved locally when persistence is enabled.

**Success condition**  
User can identify at least one affected body system and open the evidence supporting its statement without the app implying a personal diagnosis.

### P0-J2 — Compare reduction

**Starting condition**  
Current cigarettes/day is non-zero.

**User action**  
Sets a lower target cigarettes/day.

**Application response**  
The UI compares current and target exposure, communicates that lower exposure is directionally preferable, and keeps a clear warning that a non-zero target is not safe.

**Persisted/resulting state**  
Target value is stored locally.

**Success condition**  
The comparison contains no unsupported personal-risk percentage or medical-severity score.

### P0-J3 — Explore zero and recovery

**Starting condition**  
User is in Body Impact or compare mode.

**User action**  
Sets the selected/target value to zero.

**Application response**  
Exposure visualization transitions to Recovery mode and presents the cessation timeline.

**Persisted/resulting state**  
Zero target is stored locally; optional quit date/time is stored only if the user enters it.

**Success condition**  
The user can see the difference between a generic recovery timeline and a personally positioned timeline, and neither is presented as a guaranteed personal outcome.

### P0-J4 — Verify a claim

**Starting condition**  
A health claim is visible.

**User action**  
Opens its evidence details.

**Application response**  
Shows source organization/title, claim class, interpretation caveat, and source link.

**Persisted/resulting state**  
None required.

**Success condition**  
Every quantitative claim visible in V1 can be traced to a source record without inspecting application code.

---

## 8. Objective acceptance criteria

### Functional

- `AC-F01` User can select every integer from 0 through 40 cigarettes/day.
- `AC-F02` Numeric entry and slider stay synchronized.
- `AC-F03` Invalid values are rejected or clamped without NaN/Infinity/blank output.
- `AC-F04` Changing cigarettes/day updates the body-impact state without page reload.
- `AC-F05` Every V1 body system can be opened by pointer, keyboard, and screen-reader-accessible control.
- `AC-F06` Current and target values can be compared when target ≤ current.
- `AC-F07` Target > current is either blocked for “reduction compare” or explicitly treated as increased exposure; it may never be described as improvement.
- `AC-F08` Selecting zero activates Recovery mode.
- `AC-F09` Optional quit date/time correctly positions the user on the recovery timeline using calendar/time arithmetic without shifting the entered date because of timezone parsing.
- `AC-F10` Reload restores locally persisted Body Impact settings when persistence is enabled.

### Evidence and medical-safety

- `AC-E01` 100% of quantitative health claims shown in the UI have a populated evidence record and source URL.
- `AC-E02` 100% of population-risk statistics include a population/interpretation caveat.
- `AC-E03` No UI string contains an individual organ-damage percentage derived from cigarettes/day.
- `AC-E04` No non-zero cigarettes/day state contains the words or semantic equivalent of “safe,” “healthy,” or “risk-free.”
- `AC-E05` No personal disease probability is generated from cigarette count alone.
- `AC-E06` Visual intensity is labelled/documented as illustrative exposure emphasis, not measured physical damage.
- `AC-E07` Recovery timeline claims match the approved evidence dataset and do not promise exact individual recovery.
- `AC-E08` Runtime application contains no generative model path capable of creating health claims.
- `AC-E09` Evidence dataset is reviewed as part of the release candidate and its review date is recorded.
- `AC-E10` The persistent educational disclaimer is visible or reachable from every Body Impact state.

### UX and accessibility

- `AC-U01` A first-time user can reach current exposure → lower target → zero/recovery in ≤ 60 seconds in usability verification.
- `AC-U02` Primary workflow is fully usable at 320 CSS px width without page-level horizontal scrolling.
- `AC-U03` All interactive targets meet the app’s accessible touch-target standard.
- `AC-U04` Color is not the sole indicator of exposure or selected body system.
- `AC-U05` `prefers-reduced-motion` removes nonessential transitions while retaining all information.
- `AC-U06` Keyboard focus remains visible throughout the flow.
- `AC-U07` Screen-reader labels distinguish current value, target value, selected body system, evidence details, and recovery mode.

### Privacy and security

- `AC-P01` Body Impact introduces no account, backend, analytics, ad SDK, fingerprinting, geolocation, camera, microphone, or notification permission.
- `AC-P02` Smoking inputs and optional quit date/time remain in local browser storage only.
- `AC-P03` Existing export/import/reset behavior either safely includes the new state or the feature contract explicitly keeps it separate; no silent data loss is allowed.
- `AC-P04` Imported Body Impact state is schema-validated and bounded before use.
- `AC-P05` Reset removes Body Impact local state together with the parent app’s reset contract.

### Production/release

- `AC-R01` Existing Permission to Smoke critical urge → pause → decision flow has no regression.
- `AC-R02` Production build passes.
- `AC-R03` Existing and new automated tests pass.
- `AC-R04` Body Impact receives the applicable Sharva QA-12 checks for an R4 feature.
- `AC-R05` Mobile browser verification includes iPhone-size layout and touch interaction.
- `AC-R06` Offline reopen preserves the last usable Body Impact shell/content after successful cache installation.
- `AC-R07` No unresolved P0/P1 defect remains at production approval.
- `AC-R08` Release identity, source SHA, deployment, evidence review, and final assurance are reconciled before `PRODUCTION_VERIFIED`.

---

## 9. Content and visualization contract

The visual direction is not locked by this Product Contract, but the future UI contract must preserve these boundaries:

- Human anatomy may be stylized/clinical but must not pretend to be the user’s scan or photograph.
- No gore, blackened-organ scare graphics, or fabricated before/after anatomy.
- Stronger visual emphasis as cigarettes/day rises is allowed only as an educational encoding of exposure.
- The visual must have a textual equivalent.
- Organ/system labels must remain readable on mobile.
- Recovery mode should feel meaningfully more hopeful than exposure mode without implying guaranteed repair.

---

## 10. Data contract for V1

Minimum local state:

```text
bodyImpact.currentCigarettesPerDay: integer 0..40
bodyImpact.targetCigarettesPerDay: integer 0..40 | null
bodyImpact.quitDateTime: ISO datetime | null
bodyImpact.selectedBodySystem: enum | null
bodyImpact.evidenceDatasetVersion: string
bodyImpact.uiVersion: string
```

Rules:

- Existing urge/outcome history is not assumed to equal total cigarettes consumed.
- V1 must not automatically calculate cigarettes/day from urge logs.
- If future tracking completeness is established, that integration requires a separate contract change.

---

## 11. Failure states

The feature must fail safely.

- Missing evidence record → do not render the health claim.
- Invalid local state → revert to validated defaults and preserve recoverable parent-app data.
- Unsupported imported version → reject or migrate explicitly; never silently coerce unsafe values.
- Source link unavailable → keep the claim only if the bundled reviewed evidence record is valid; show source metadata and do not fabricate a replacement link.
- Optional quit date/time in the future → validation error; do not render a negative recovery duration.
- Reduced-motion environment → static state, no information loss.

---

## 12. Release blockers

Body Impact cannot advance to production approval if any of the following is true:

1. A displayed quantitative claim lacks provenance.
2. A cigarettes/day value is converted into unsupported personal damage/risk.
3. A non-zero level is presented as safe.
4. Recovery language guarantees individual outcomes.
5. Existing Permission to Smoke P0 behavior regresses.
6. New local state can corrupt existing history/settings.
7. Evidence review is missing for the candidate release.
8. Applicable accessibility, mobile, offline, security, or QA-12 gates fail.
9. Source/deployment identity cannot be reconciled.

---

## 13. V1 definition of done

Body Impact V1 is complete only when:

**Product Contract locked → UX contract approved → UI contract locked → architecture change documented → vertical slice verified → full implementation complete → evidence dataset reviewed → automated/manual QA complete → existing P0 flow regression-tested → preview verified → production deployed from known source → live production exercised → independent release assurance passes.**

Creating the UI, merging code, or deploying a build alone does not satisfy this definition.

---

## 14. Next lifecycle gate

With this Product Contract locked, the next gate is **UX Contract / visual strategy**.

The UX stage must decide:

1. where Body Impact enters the existing navigation;
2. whether the primary interaction is body-first, slider-first, or compare-first;
3. mobile information hierarchy;
4. how evidence details open without overwhelming the main experience;
5. how exposure mode visually transitions into recovery mode;
6. how current versus target smoking is compared without implying fake quantitative precision.

No substantial implementation should begin before that UX decision is locked.
