"use strict";

// Browser smoke test: serve the repo over HTTP, drive a real Chromium
// (system Chrome or Edge) and check that the game boots. Runs via
// `npm run test:e2e`; kept out of `npm test` because it needs a browser.

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..", "..");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

/** First Chrome/Edge executable that exists, or undefined. */
function findBrowser() {
  const pf = process.env["ProgramFiles"] || "C:/Program Files";
  const pf86 = process.env["ProgramFiles(x86)"] || "C:/Program Files (x86)";
  const local = process.env.LOCALAPPDATA;
  return [
    process.env.CHROME_PATH,
    path.join(pf, "Google/Chrome/Application/chrome.exe"),
    path.join(pf86, "Google/Chrome/Application/chrome.exe"),
    local && path.join(local, "Google/Chrome/Application/chrome.exe"),
    path.join(pf, "Microsoft/Edge/Application/msedge.exe"),
    path.join(pf86, "Microsoft/Edge/Application/msedge.exe"),
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean).find((p) => {
    try { return fs.existsSync(p); } catch { return false; }
  });
}

/** Minimal static file server rooted at the repo, on a random free port. */
function startServer() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(ROOT, rel === "/" ? "index.html" : rel);
    if (!filePath.startsWith(ROOT)) return void res.writeHead(403).end();
    fs.readFile(filePath, (err, buf) => {
      if (err) return void res.writeHead(404).end("not found");
      res.writeHead(200, {
        "content-type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/** Reads #canvas back as pixels and reports whether anything is painted. */
function canvasState() {
  const c = document.getElementById("canvas");
  if (!c) return { present: false, painted: false };
  const { data } = c.getContext("2d").getImageData(0, 0, c.width, c.height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 0) return { present: true, painted: true };
  }
  return { present: true, painted: false };
}

const browserPath = findBrowser();
const opts = browserPath ? {} : { skip: "no Chrome/Edge executable found (set CHROME_PATH)" };

let server;
let browser;
let page;
let baseUrl;
const consoleErrors = [];
const pageErrors = [];

before(async () => {
  if (!browserPath) return;
  server = await startServer();
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ["--no-sandbox", "--mute-audio"],
  });
  page = await browser.newPage();
  // A genuinely missing script/style/image still surfaces as a console
  // "error" ("Failed to load resource: 404"); `requestfailed` is not
  // watched because the browser routinely aborts the unplayed background
  // music preload when the page closes.
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
});

after(async () => {
  await browser?.close();
  await new Promise((r) => (server ? server.close(r) : r()));
});

test("the start screen renders with a Play button", opts, async () => {
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForSelector("#btn-play", { visible: true });
  assert.equal(await page.$eval("#startScreen", (el) => getComputedStyle(el).display !== "none"), true);
  const state = await page.evaluate(canvasState);
  assert.equal(state.present, true, "#canvas should exist");
  assert.equal(state.painted, false, "#canvas should be blank before Play");
});

test("pressing Play boots the world and paints the canvas", opts, async () => {
  await page.click("#btn-play");
  await page.waitForFunction(() => {
    const c = document.getElementById("canvas");
    if (!c) return false;
    const { data } = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    for (let i = 3; i < data.length; i += 4) if (data[i] !== 0) return true;
    return false;
  }, { timeout: 20000 });
  assert.equal(await page.$eval("#startScreen", (el) => getComputedStyle(el).display === "none"), true);
});

test("startup produced no console errors or failed requests", opts, () => {
  assert.deepEqual(consoleErrors, [], `console errors:\n${consoleErrors.join("\n")}`);
  assert.deepEqual(pageErrors, [], `page errors:\n${pageErrors.join("\n")}`);
});
