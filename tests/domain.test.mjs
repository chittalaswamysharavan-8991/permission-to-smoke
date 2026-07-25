import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateStats,
  cancelSession,
  createInitialState,
  finishSession,
  normalizeState,
  parseImport,
  serializeExport,
  startSession,
  updateSettings
} from "../src/domain.mjs";

const t0 = new Date("2026-07-25T12:00:00.000Z");

test("starts a sanitized timed pause", () => {
  const state = startSession(createInitialState(t0), {
    intensity: 9,
    trigger: "Stress<script>",
    note: "Need a minute <now>",
    delayMinutes: 10
  }, t0);
  assert.equal(state.activeSession.intensity, 5);
  assert.equal(state.activeSession.trigger, "Stressscript");
  assert.equal(state.activeSession.note, "Need a minute now");
  assert.equal(state.activeSession.endsAt, "2026-07-25T12:10:00.000Z");
});

test("records skipped and smoked outcomes", () => {
  let state = createInitialState(t0);
  state = startSession(state, { intensity: 3, trigger: "After food", delayMinutes: 10 }, t0);
  state = finishSession(state, "skipped", new Date("2026-07-25T12:10:00.000Z"));
  assert.equal(state.sessions[0].outcome, "skipped");
  assert.equal(state.sessions[0].waitedSeconds, 600);
  assert.equal(state.activeSession, null);
  assert.throws(() => finishSession({ ...state, activeSession: { id: "x", startedAt: t0.toISOString() } }, "maybe", t0));
});

test("calculates same-day progress, protected spend and seven-day series", () => {
  let state = createInitialState(t0);
  state = updateSettings(state, { dailyTarget: 3, cigaretteCost: 22, defaultDelayMinutes: 10, baselinePerDay: 6 });
  state.sessions = [
    { id: "1", outcome: "skipped", completedAt: "2026-07-25T10:00:00.000Z" },
    { id: "2", outcome: "smoked", completedAt: "2026-07-25T11:00:00.000Z" },
    { id: "3", outcome: "skipped", completedAt: "2026-07-24T11:00:00.000Z" }
  ];
  const stats = calculateStats(state, t0);
  assert.equal(stats.smokedToday, 1);
  assert.equal(stats.skippedToday, 1);
  assert.equal(stats.targetRemaining, 2);
  assert.equal(stats.moneyProtected, 44);
  assert.equal(stats.successRate, 67);
  assert.equal(stats.last7.length, 7);
});

test("normalizes malformed stored state and supports export/import", () => {
  const normalized = normalizeState({ sessions: "bad", settings: { dailyTarget: 2 } }, t0);
  assert.equal(normalized.sessions.length, 0);
  assert.equal(normalized.settings.dailyTarget, 2);
  assert.equal(normalized.settings.defaultDelayMinutes, 10);
  const restored = parseImport(serializeExport(normalized, t0), t0);
  assert.deepEqual(restored.settings, normalized.settings);
});

test("cancel removes only active pause", () => {
  const base = createInitialState(t0);
  const active = startSession(base, { intensity: 2, trigger: "Habit", delayMinutes: 5 }, t0);
  const cancelled = cancelSession(active);
  assert.equal(cancelled.activeSession, null);
  assert.deepEqual(cancelled.sessions, []);
});

test("does not overwrite an active pause", () => {
  const first = startSession(createInitialState(t0), {
    intensity: 4,
    trigger: "Stress",
    delayMinutes: 10
  }, t0);
  const second = startSession(first, {
    intensity: 1,
    trigger: "Habit",
    delayMinutes: 5
  }, new Date("2026-07-25T12:01:00.000Z"));
  assert.equal(second, first);
  assert.equal(second.activeSession.trigger, "Stress");
  assert.equal(second.activeSession.endsAt, "2026-07-25T12:10:00.000Z");
});

test("hardens imported settings and rejects invalid active sessions", () => {
  const restored = parseImport(JSON.stringify({
    data: {
      settings: {
        dailyTarget: "not-a-number",
        defaultDelayMinutes: 999,
        baselinePerDay: -10,
        cigaretteCost: "broken",
        currency: "<img src=x onerror=alert(1)>",
        reducedMotion: "true"
      },
      sessions: [
        { id: "valid-1", outcome: "skipped", completedAt: "2026-07-25T10:00:00.000Z" },
        { id: "invalid", outcome: "maybe", completedAt: "not-a-date" }
      ],
      activeSession: {
        id: "bad-active",
        startedAt: "not-a-date",
        endsAt: "also-bad"
      }
    }
  }), t0);

  assert.equal(restored.settings.dailyTarget, 4);
  assert.equal(restored.settings.defaultDelayMinutes, 60);
  assert.equal(restored.settings.baselinePerDay, 0);
  assert.equal(restored.settings.cigaretteCost, 20);
  assert.equal(restored.settings.currency, "₹");
  assert.equal(restored.settings.reducedMotion, false);
  assert.equal(restored.sessions.length, 1);
  assert.equal(restored.activeSession, null);
});

test("rejects non-object backup payloads", () => {
  assert.throws(() => parseImport('"not-an-object"', t0), /Invalid backup data/);
});
