import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const execFileAsync = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("production build resolves file URLs on the host operating system", async () => {
  const { stdout } = await execFileAsync(process.execPath, ["scripts/build.mjs"], { cwd: root });
  assert.match(stdout, /Production bundle created/);
  await access(join(root, "dist", "src", "app.js"));
  const metadata = JSON.parse(await readFile(join(root, "dist", "build-meta.json"), "utf8"));
  assert.equal(metadata.version, "1.0.1");
});
