"use strict";

// Scans every HTML/CSS/JS/Markdown file in the repo for local asset
// references (src/href attributes, CSS url() calls) and asserts each
// one resolves to a real file. Catches the class of bug where an
// asset is renamed or removed but a reference to its old path is
// left behind (e.g. a stylesheet still pointing at a deleted font).

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readdirSync, readFileSync, existsSync, statSync } = require("node:fs");
const { join, dirname, extname, sep } = require("node:path");

const ROOT = join(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".git", "dist"]);
const SCAN_EXT = new Set([".html", ".css", ".js", ".mjs", ".md"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const REF_PATTERNS = [
  /(?:src|href)\s*=\s*"([^"]+)"/g,
  /(?:src|href)\s*=\s*'([^']+)'/g,
  /url\(\s*"?'?([^"')]+)"?'?\s*\)/g,
];

test("every local src/href/url() reference resolves to a real file", () => {
  const files = walk(ROOT).filter((f) => SCAN_EXT.has(extname(f).toLowerCase()));
  const problems = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const baseDir = dirname(file);
    for (const re of REF_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(content))) {
        const ref = m[1].trim();
        if (!ref || /^(https?:|mailto:|data:|#|\/\/)/.test(ref)) continue;
        const cleanRef = ref.split("?")[0].split("#")[0];
        if (!cleanRef) continue;
        const resolved = cleanRef.startsWith("/") ? join(ROOT, cleanRef) : join(baseDir, cleanRef);
        if (!existsSync(resolved)) {
          problems.push(`${file.replace(ROOT + sep, "")} -> "${cleanRef}"`);
        }
      }
    }
  }

  assert.deepEqual(problems, [], `broken local reference(s):\n${problems.join("\n")}`);
});
