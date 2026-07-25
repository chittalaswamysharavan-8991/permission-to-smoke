export const STORAGE_VERSION = 1;

export const DEFAULT_SETTINGS = Object.freeze({
  dailyTarget: 4,
  defaultDelayMinutes: 10,
  baselinePerDay: 6,
  cigaretteCost: 20,
  currency: "₹",
  reducedMotion: false
});

export function createInitialState(now = new Date()) {
  return {
    version: STORAGE_VERSION,
    createdAt: now.toISOString(),
    settings: { ...DEFAULT_SETTINGS },
    sessions: [],
    activeSession: null
  };
}

export function normalizeState(input, now = new Date()) {
  const base = createInitialState(now);
  if (!isRecord(input)) return base;

  const settings = normalizeSettings(input.settings, base.settings);
  const sessions = Array.isArray(input.sessions)
    ? input.sessions.map(normalizeCompletedSession).filter(Boolean).slice(0, 2000)
    : [];

  return {
    version: STORAGE_VERSION,
    createdAt: isValidDate(input.createdAt) ? new Date(input.createdAt).toISOString() : base.createdAt,
    settings,
    sessions,
    activeSession: normalizeActiveSession(input.activeSession, settings)
  };
}

export function startSession(state, details, now = new Date()) {
  if (state.activeSession) return state;

  const intensity = clampNumber(details.intensity, 1, 5, 3);
  const delayMinutes = clampNumber(
    details.delayMinutes,
    1,
    60,
    state.settings.defaultDelayMinutes
  );
  const activeSession = {
    id: `urge-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: now.toISOString(),
    endsAt: new Date(now.getTime() + delayMinutes * 60_000).toISOString(),
    intensity,
    trigger: sanitizeText(details.trigger, 80),
    note: sanitizeText(details.note, 240),
    delayMinutes,
    status: "pausing"
  };
  return { ...state, activeSession };
}

export function finishSession(state, outcome, now = new Date()) {
  if (!state.activeSession) return state;
  if (!["skipped", "smoked"].includes(outcome)) {
    throw new Error("Invalid session outcome");
  }
  const completed = {
    ...state.activeSession,
    outcome,
    completedAt: now.toISOString(),
    waitedSeconds: Math.max(
      0,
      Math.round((now.getTime() - new Date(state.activeSession.startedAt).getTime()) / 1000)
    )
  };
  return {
    ...state,
    sessions: [completed, ...state.sessions].slice(0, 2000),
    activeSession: null
  };
}

export function cancelSession(state) {
  return { ...state, activeSession: null };
}

export function updateSettings(state, patch = {}) {
  return {
    ...state,
    settings: normalizeSettings(patch, state.settings)
  };
}

export function getDayKey(dateLike) {
  const date = new Date(dateLike);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStats(state, now = new Date()) {
  const today = getDayKey(now);
  const todaySessions = state.sessions.filter((session) => getDayKey(session.completedAt) === today);
  const smokedToday = todaySessions.filter((session) => session.outcome === "smoked").length;
  const skippedToday = todaySessions.filter((session) => session.outcome === "skipped").length;
  const completedToday = todaySessions.length;
  const allSkipped = state.sessions.filter((session) => session.outcome === "skipped").length;
  const allSmoked = state.sessions.filter((session) => session.outcome === "smoked").length;
  const moneyProtected = allSkipped * state.settings.cigaretteCost;
  const targetRemaining = Math.max(0, state.settings.dailyTarget - smokedToday);
  const successRate = state.sessions.length
    ? Math.round((allSkipped / state.sessions.length) * 100)
    : 0;

  const last7 = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const key = getDayKey(date);
    const sessions = state.sessions.filter((session) => getDayKey(session.completedAt) === key);
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
      smoked: sessions.filter((session) => session.outcome === "smoked").length,
      skipped: sessions.filter((session) => session.outcome === "skipped").length
    };
  });

  return {
    smokedToday,
    skippedToday,
    completedToday,
    targetRemaining,
    allSkipped,
    allSmoked,
    moneyProtected,
    successRate,
    last7
  };
}

export function serializeExport(state, now = new Date()) {
  return JSON.stringify(
    {
      app: "Permission to Smoke",
      exportedAt: now.toISOString(),
      data: state
    },
    null,
    2
  );
}

export function parseImport(text, now = new Date()) {
  const parsed = JSON.parse(text);
  const candidate = parsed?.data ?? parsed;
  if (!isRecord(candidate)) throw new Error("Invalid backup data");
  return normalizeState(candidate, now);
}

function normalizeSettings(input, fallback) {
  const patch = isRecord(input) ? input : {};
  return {
    dailyTarget: clampNumber(patch.dailyTarget, 0, 50, fallback.dailyTarget),
    defaultDelayMinutes: clampNumber(
      patch.defaultDelayMinutes,
      1,
      60,
      fallback.defaultDelayMinutes
    ),
    baselinePerDay: clampNumber(patch.baselinePerDay, 0, 100, fallback.baselinePerDay),
    cigaretteCost: clampNumber(patch.cigaretteCost, 0, 10000, fallback.cigaretteCost),
    currency: sanitizeCurrency(patch.currency, fallback.currency),
    reducedMotion:
      typeof patch.reducedMotion === "boolean" ? patch.reducedMotion : fallback.reducedMotion
  };
}

function normalizeActiveSession(input, settings) {
  if (!isRecord(input) || !isValidDate(input.startedAt) || !isValidDate(input.endsAt)) return null;
  const startedAt = new Date(input.startedAt);
  const endsAt = new Date(input.endsAt);
  if (endsAt.getTime() < startedAt.getTime()) return null;

  return {
    id: sanitizeId(input.id) || `urge-restored-${startedAt.getTime()}`,
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    intensity: clampNumber(input.intensity, 1, 5, 3),
    trigger: sanitizeText(input.trigger, 80),
    note: sanitizeText(input.note, 240),
    delayMinutes: clampNumber(input.delayMinutes, 1, 60, settings.defaultDelayMinutes),
    status: "pausing"
  };
}

function normalizeCompletedSession(input) {
  if (
    !isRecord(input) ||
    !sanitizeId(input.id) ||
    !["skipped", "smoked"].includes(input.outcome) ||
    !isValidDate(input.completedAt)
  ) {
    return null;
  }

  const completedAt = new Date(input.completedAt);
  const startedAt = isValidDate(input.startedAt) ? new Date(input.startedAt) : completedAt;
  const endsAt = isValidDate(input.endsAt) ? new Date(input.endsAt) : completedAt;

  return {
    id: sanitizeId(input.id),
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    intensity: clampNumber(input.intensity, 1, 5, 3),
    trigger: sanitizeText(input.trigger, 80),
    note: sanitizeText(input.note, 240),
    delayMinutes: clampNumber(input.delayMinutes, 1, 60, 10),
    status: "completed",
    outcome: input.outcome,
    completedAt: completedAt.toISOString(),
    waitedSeconds: clampNumber(input.waitedSeconds, 0, 86400, 0)
  };
}

function sanitizeCurrency(value, fallback) {
  const candidate = String(value ?? "").trim();
  if (/^(?:[\p{Sc}]|[A-Za-z]{1,4})$/u.test(candidate)) return candidate;
  return fallback || DEFAULT_SETTINGS.currency;
}

function sanitizeId(value) {
  return String(value ?? "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 100);
}

function sanitizeText(value, maxLength) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, Math.round(numeric * 100) / 100));
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidDate(value) {
  return typeof value === "string" && Number.isFinite(new Date(value).getTime());
}
