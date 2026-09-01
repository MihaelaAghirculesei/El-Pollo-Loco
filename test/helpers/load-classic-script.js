"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..", "..");

/**
 * Runs one or more of the game's classic (non-module) scripts inside a
 * fresh `node:vm` context and returns that context, so the plain functions
 * they declare can be unit-tested without a browser and without changing a
 * line of the game source. Top-level `function` declarations in a sloppy
 * script become properties of the context's global object.
 * @param {string[]} relPaths - Repo-relative script paths, loaded in order.
 * @param {object} [seed] - Extra globals the scripts close over (stub
 *   classes for `instanceof`, a `console`, …).
 * @returns {object} The populated VM context.
 */
function loadClassicScripts(relPaths, seed = {}) {
  const context = vm.createContext({ console, ...seed });
  for (const rel of relPaths) {
    const code = fs.readFileSync(path.join(repoRoot, rel), "utf8");
    vm.runInContext(code, context, { filename: rel });
  }
  return context;
}

module.exports = { loadClassicScripts };
