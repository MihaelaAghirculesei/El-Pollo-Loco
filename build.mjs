// Static-copy build: assemble the deployable site under dist/.
// Cross-platform replacement for the old POSIX shell one-liner
// (`rm -rf dist && mkdir -p dist && cp -r … dist/`); same file set.

import { rm, mkdir, cp } from "node:fs/promises";
import { join } from "node:path";

const OUT = "dist";

// Everything the deployed site needs — and nothing else (no package
// manifests, tooling config, tests or node_modules).
const ENTRIES = [
  "index.html",
  "impressum.html",
  "impressum.css",
  "style.css",
  "favicon.svg",
  "_headers",
  "fonts",
  "audio",
  "img_pollo_locco",
  "js",
  "models",
  "levels",
];

try {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  for (const entry of ENTRIES) {
    await cp(entry, join(OUT, entry), { recursive: true });
  }
  console.log(`build: copied ${ENTRIES.length} entries into ${OUT}/`);
} catch (err) {
  console.error(`build failed: ${err.message}`);
  process.exit(1);
}
