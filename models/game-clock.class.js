/**
 * Timers that run on the world's requestAnimationFrame loop instead of the
 * browser's own setInterval / setTimeout.
 *
 * The world advances the clock once per frame by the elapsed time, so every
 * entity loop (movement, gravity, walk cycles, removal delays) keeps its
 * cadence in milliseconds, stops while the tab is in the background, and
 * stays in step with the frame that draws it. The API mirrors the browser
 * timer functions, so entities only swap `setInterval(...)` for
 * `gameClock.setInterval(...)`.
 */
class GameClock {
  /** Shortest allowed interval, so a 0 ms interval cannot spin forever. */
  static MIN_INTERVAL_MS = 1;

  now = 0;
  nextId = 1;
  timers = new Map();

  /**
   * Calls `fn` every `ms` milliseconds of game time.
   * @param {Function} fn - Callback
   * @param {number} ms - Interval in milliseconds
   * @returns {number} Timer id for clearInterval
   */
  setInterval(fn, ms) {
    const every = Math.max(GameClock.MIN_INTERVAL_MS, Number(ms) || 0);
    return this.add(fn, every, every);
  }

  /**
   * Calls `fn` once after `ms` milliseconds of game time.
   * @param {Function} fn - Callback
   * @param {number} ms - Delay in milliseconds
   * @returns {number} Timer id for clearTimeout
   */
  setTimeout(fn, ms) {
    return this.add(fn, Math.max(0, Number(ms) || 0), 0);
  }

  /**
   * Cancels an interval. Unknown or empty ids are ignored.
   * @param {number} id - Timer id
   */
  clearInterval(id) {
    this.timers.delete(id);
  }

  /**
   * Cancels a timeout. Unknown or empty ids are ignored.
   * @param {number} id - Timer id
   */
  clearTimeout(id) {
    this.timers.delete(id);
  }

  /**
   * Registers a timer.
   * @param {Function} fn - Callback
   * @param {number} delay - Milliseconds until the first call
   * @param {number} every - Repeat interval, 0 for a one-shot timer
   * @returns {number} Timer id
   */
  add(fn, delay, every) {
    const id = this.nextId++;
    this.timers.set(id, { fn, due: this.now + delay, every });
    return id;
  }

  /**
   * Moves game time forward and runs every timer that falls due, in due
   * order. An interval that is more than one period behind runs once per
   * missed period, like the browser's own catch-up. Timers added while
   * advancing start counting from the current game time.
   * @param {number} dt - Elapsed milliseconds
   */
  advance(dt) {
    const target = this.now + Math.max(0, dt);
    let timer = this.nextDue(target);
    while (timer) {
      const [id, t] = timer;
      this.now = t.due;
      if (t.every) t.due += t.every;
      else this.timers.delete(id);
      this.run(t.fn);
      timer = this.nextDue(target);
    }
    this.now = target;
  }

  /**
   * Finds the earliest timer due at or before `target`; ties go to the
   * timer registered first.
   * @param {number} target - Game time to look up to
   * @returns {[number, Object] | undefined} Id and timer, if any
   */
  nextDue(target) {
    let best;
    for (const entry of this.timers) {
      const due = entry[1].due;
      if (due <= target && (!best || due < best[1].due)) best = entry;
    }
    return best;
  }

  /**
   * Runs one callback; an error is reported without stopping the frame.
   * @param {Function} fn - Callback
   */
  run(fn) {
    try {
      fn();
    } catch (err) {
      if (typeof reportError === "function") reportError(err);
      else console.error(err);
    }
  }

  /**
   * Drops every timer and restarts game time. Called when a new world is
   * built, so nothing from a finished run can fire in the next one.
   */
  reset() {
    this.timers.clear();
    this.now = 0;
  }
}

const gameClock = new GameClock();
