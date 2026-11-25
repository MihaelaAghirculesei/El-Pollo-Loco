"use strict";

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { loadClassicScripts } = require("./helpers/load-classic-script");

const ctx = loadClassicScripts(["models/game-clock.class.js"]);
// `class` and `const` at the top of a classic script are global lexical
// bindings, not properties of the context object, so read them by name.
const GameClock = vm.runInContext("GameClock", ctx);

describe("GameClock", () => {
  let clock;
  beforeEach(() => {
    clock = new GameClock();
  });

  it("runs an interval once per elapsed period", () => {
    let calls = 0;
    clock.setInterval(() => calls++, 100);
    clock.advance(99);
    assert.equal(calls, 0);
    clock.advance(1);
    assert.equal(calls, 1);
    clock.advance(250);
    assert.equal(calls, 3);
  });

  it("keeps the cadence across uneven frames", () => {
    let calls = 0;
    clock.setInterval(() => calls++, 1000 / 60);
    for (let i = 0; i < 60; i++) clock.advance(i % 2 ? 10 : 23.3334);
    assert.equal(calls, 60);
  });

  it("runs a timeout once and then forgets it", () => {
    let calls = 0;
    clock.setTimeout(() => calls++, 300);
    clock.advance(299);
    assert.equal(calls, 0);
    clock.advance(1000);
    assert.equal(calls, 1);
    assert.equal(clock.timers.size, 0);
  });

  it("does nothing while no time passes", () => {
    let calls = 0;
    clock.setInterval(() => calls++, 16);
    clock.advance(0);
    clock.advance(-50);
    assert.equal(calls, 0);
  });

  it("cancels with clearInterval / clearTimeout and ignores empty ids", () => {
    let calls = 0;
    const a = clock.setInterval(() => calls++, 10);
    const b = clock.setTimeout(() => calls++, 10);
    clock.clearInterval(a);
    clock.clearTimeout(b);
    clock.clearInterval(undefined);
    clock.clearTimeout(null);
    clock.advance(100);
    assert.equal(calls, 0);
  });

  it("lets a callback cancel its own interval", () => {
    let calls = 0;
    const id = clock.setInterval(() => {
      calls++;
      if (calls === 2) clock.clearInterval(id);
    }, 10);
    clock.advance(100);
    assert.equal(calls, 2);
  });

  it("fires timers in due order, ties in registration order", () => {
    const order = [];
    clock.setTimeout(() => order.push("c"), 30);
    clock.setTimeout(() => order.push("a"), 10);
    clock.setTimeout(() => order.push("b1"), 20);
    clock.setTimeout(() => order.push("b2"), 20);
    clock.advance(50);
    assert.deepEqual(order, ["a", "b1", "b2", "c"]);
  });

  it("starts a timer added during advance from the current game time", () => {
    const seen = [];
    clock.setTimeout(() => {
      seen.push(clock.now);
      clock.setTimeout(() => seen.push(clock.now), 15);
    }, 10);
    clock.advance(20);
    assert.deepEqual(seen, [10]);
    clock.advance(5);
    assert.deepEqual(seen, [10, 25]);
  });

  it("turns a 0 ms interval into a 1 ms one instead of looping forever", () => {
    let calls = 0;
    clock.setInterval(() => calls++, 0);
    clock.advance(5);
    assert.equal(calls, 5);
  });

  it("keeps running the other timers when a callback throws", () => {
    const errors = [];
    const original = console.error;
    console.error = (e) => errors.push(e);
    try {
      let calls = 0;
      clock.setTimeout(() => {
        throw new Error("boom");
      }, 10);
      clock.setTimeout(() => calls++, 20);
      clock.advance(30);
      assert.equal(calls, 1);
      assert.equal(errors.length, 1);
    } finally {
      console.error = original;
    }
  });

  it("reset drops every timer and restarts game time", () => {
    let calls = 0;
    clock.setInterval(() => calls++, 10);
    clock.advance(25);
    clock.reset();
    assert.equal(clock.now, 0);
    clock.advance(100);
    assert.equal(calls, 2);
  });
});

describe("gameClock", () => {
  it("is a shared GameClock instance", () => {
    assert.ok(vm.runInContext("gameClock instanceof GameClock", ctx));
  });
});
