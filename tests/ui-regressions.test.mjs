import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8")
]);

test("pause decision button keeps readable text contrast", () => {
  assert.match(styles, /\.secondary\{[^}]*background:#fff[^}]*color:var\(--ink\)/);
  assert.match(app, /I'm ready to decide/);
});

test("active pause exposes a resume path instead of a second start", () => {
  assert.match(app, /Return to active pause/);
  assert.match(app, /button\(`Return to active pause[\s\S]*?'resume','urge'\)/);
  assert.match(app, /view=state\.activeSession\?'pause':'checkin'/);
});

test("currency output is escaped at the DOM sink", () => {
  assert.match(app, /esc\(state\.settings\.currency\)/);
});
