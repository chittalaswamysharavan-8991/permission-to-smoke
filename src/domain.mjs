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
  if (!input || typeof input !== "object") return base;
  return {
    version: STORAGE_VERSION,
    createdAt: typeof input.createdAt === "string" ? input.createdAt : base.createdAt,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(input.settings && typeof input.settings === "object" ? input.settings : {})
    },
    sessions: Array.isArray(input.sessions)
      ? input.sessions.filter((item) => item && typeof item === "object" && typeof item.id === "string")
      : [],
    activeSession:
      input.activeSession && typeof input.activeSession === "object" ? input.activeSession : null
  };
}

export function startSession(state, details, now = new Date()) {
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

export function updateSettings(state, patch) {
  const next = {
    ...state.settings,
    dailyTarget: clampNumber(patch.dailyTarget, 0, 50, state.settings.dailyTarget),
    defaultDelayMinutes: clampNumber(
      patch.defaultDelayMinutes,
      1,
      60,
      state.settings.defaultDelayMinutes
    ),
    baselinePerDay: clampNumber(patch.baselinePerDay, 0, 100, state.settings.baselinePerDay),
    cigaretteCost: clampNumber(patch.cigaretteCost, 0, 10000, state.settings.cigaretteCost),
    currency: sanitizeText(patch.currency ?? state.settings.currency, 4) || "₹",
    reducedMotion: Boolean(patch.reducedMotion)
  };
  return { ...state, settings: next };
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
  return normalizeState(candidate, now);
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
