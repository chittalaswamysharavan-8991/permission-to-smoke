import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
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

const sourceRepository =
  process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : undefined;
const metadata = {
  version: "1.0.1",
  builtAt: new Date().toISOString(),
  ...(sourceRepository ? { sourceRepository } : {}),
  ...(process.env.VERCEL_GIT_COMMIT_REF ? { sourceBranch: process.env.VERCEL_GIT_COMMIT_REF } : {}),
  ...(process.env.VERCEL_GIT_COMMIT_SHA ? { sourceCommit: process.env.VERCEL_GIT_COMMIT_SHA } : {}),
  deploymentMode: process.env.VERCEL ? "Vercel Git build" : "local build"
};
await writeFile(join(out, "build-meta.json"), JSON.stringify(metadata, null, 2));
console.log("Production bundle created in dist/");

async function copy(relative) {
  const source = join(root, relative);
  const destination = join(out, relative);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}
