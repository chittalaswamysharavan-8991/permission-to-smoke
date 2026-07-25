import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const files = ["index.html", "styles.css", "manifest.webmanifest", "service-worker.js", "vercel.json"];
for (const file of files) await copy(file);
await cp(join(root, "src"), join(out, "src"), { recursive: true });
await cp(join(root, "icons"), join(out, "icons"), { recursive: true });

const index = await readFile(join(out, "index.html"), "utf8");
if (!index.includes("Permission to Smoke")) throw new Error("Build validation failed: title missing");
for (const required of ["styles.css", "src/app.js", "manifest.webmanifest", "service-worker.js"]) {
  await stat(join(out, required));
}
await writeFile(join(out, "build-meta.json"), JSON.stringify({ version: "1.0.0", builtAt: new Date().toISOString() }, null, 2));
console.log("Production bundle created in dist/");

async function copy(relative) {
  const source = join(root, relative);
  const destination = join(out, relative);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}
