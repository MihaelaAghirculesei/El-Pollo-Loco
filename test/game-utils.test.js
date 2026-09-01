"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadClassicScripts } = require("./helpers/load-classic-script");

// Stub entity classes for the `instanceof` branches in game-utils. The
// same references are seeded into the VM context and used here to build
// fakes, so `x instanceof Endboss` resolves consistently on both sides.
class Endboss {}
class Chicken {}
class SmallChicken {}

const g = loadClassicScripts(["models/game-utils.class.js"], {
  Endboss,
  Chicken,
  SmallChicken,
});

const NOW = () => Date.now();
const box = (x, y, width, height) => ({ x, y, width, height });

describe("isCollidingWithEnemy (20px char / 15px enemy inset)", () => {
  const character = box(100, 100, 100, 200); // core [120..180] x [120..280]

  it("overlapping cores collide", () => {
    const enemy = box(150, 150, 80, 70); // core [165..215] x [165..205]
    assert.equal(g.isCollidingWithEnemy(character, enemy), true);
  });

  it("no horizontal overlap does not collide", () => {
    assert.equal(g.isCollidingWithEnemy(character, box(300, 150, 80, 70)), false);
  });

  it("no vertical overlap does not collide", () => {
    assert.equal(g.isCollidingWithEnemy(character, box(150, 400, 80, 70)), false);
  });

  it("contact only inside the trimmed margins does not collide", () => {
    // enemy core starts at x = 205 + 15 = 220, past the char core right edge (180)
    assert.equal(g.isCollidingWithEnemy(character, box(205, 150, 80, 70)), false);
  });
});

describe("isCollidingWithItem (coin vs bottle margin)", () => {
  const character = box(100, 100, 100, 200); // core [130..170] x [130..270]
  const coin = (x, y) => ({ ...box(x, y, 100, 100), constructor: { name: "Coin" } });
  const bottle = (x, y) => ({ ...box(x, y, 100, 100), constructor: { name: "Bottle" } });

  it("detects a coin the character overlaps", () => {
    assert.equal(g.isCollidingWithItem(character, coin(120, 120)), true);
  });

  it("treats a tall item (height > 100) as a coin", () => {
    const tall = { ...box(120, 120, 100, 120), constructor: { name: "Whatever" } };
    assert.equal(g.isCollidingWithItem(character, tall), true);
  });

  it("bottle uses the tighter 10px inset, so a near miss still counts", () => {
    // item core right edge = x + width - 10. At x = 55 -> 145 > char core left 130.
    assert.equal(g.isCollidingWithItem(character, bottle(55, 120)), true);
  });

  it("same geometry as a coin (40px inset) is a miss", () => {
    // coin core right edge = 55 + 100 - 40 = 115 < char core left 130.
    assert.equal(g.isCollidingWithItem(character, coin(55, 120)), false);
  });
});

describe("insetBox", () => {
  // Power-of-two fractions so the arithmetic is exact in binary floating
  // point. The result is spread into a plain object because insetBox
  // builds it inside the VM realm (different Object.prototype).
  it("insets each side by the given fraction of the object's size", () => {
    assert.deepEqual({ ...g.insetBox(box(0, 0, 100, 100), 0.25, 0.5) }, {
      left: 25,
      right: 75,
      top: 50,
      bottom: 50,
    });
  });

  it("respects the object's origin", () => {
    assert.deepEqual({ ...g.insetBox(box(50, 40, 200, 100), 0.25, 0.25) }, {
      left: 100,
      right: 200,
      top: 65,
      bottom: 115,
    });
  });
});

describe("isBottleHittingEnemy (visible-core overlap)", () => {
  it("overlapping cores register a hit on a chicken", () => {
    const bottle = box(100, 100, 60, 60);
    const chicken = new Chicken();
    Object.assign(chicken, box(120, 110, 80, 70));
    assert.equal(g.isBottleHittingEnemy(bottle, chicken), true);
  });

  it("a glancing contact outside the cores is not a hit", () => {
    const bottle = box(100, 100, 60, 60); // core x ~[116.8..143.2]
    const chicken = new Chicken();
    Object.assign(chicken, box(160, 110, 80, 70)); // core x ~[172..228]
    assert.equal(g.isBottleHittingEnemy(bottle, chicken), false);
  });

  it("the endboss uses a wider inset, so the same geometry that hits a chicken can miss the boss", () => {
    const bottle = box(100, 120, 60, 60); // core x ~[116.8..143.2]
    const geometry = box(150, 120, 120, 120);

    const chicken = new Chicken();
    Object.assign(chicken, geometry); // core x from 150 + 120*0.15 = 168 -> miss too

    // pull the target left so a chicken core overlaps but the boss core (0.28 inset) does not
    const near = box(120, 120, 120, 120);
    const chickenNear = new Chicken();
    Object.assign(chickenNear, near); // core left = 120 + 18 = 138 < 143.2 -> hit
    const bossNear = new Endboss();
    Object.assign(bossNear, near); // core left = 120 + 33.6 = 153.6 > 143.2 -> miss

    assert.equal(g.isBottleHittingEnemy(bottle, chickenNear), true);
    assert.equal(g.isBottleHittingEnemy(bottle, bossNear), false);
    assert.equal(g.isBottleHittingEnemy(bottle, chicken), false);
  });
});

describe("calculateCooldownTime", () => {
  it("is 3000ms for the endboss", () => {
    assert.equal(g.calculateCooldownTime(new Endboss()), 3000);
  });

  it("is 1500ms for anything else", () => {
    assert.equal(g.calculateCooldownTime(new Chicken()), 1500);
    assert.equal(g.calculateCooldownTime({}), 1500);
  });
});

describe("hasRecentDirectionChange (300ms window)", () => {
  it("true just after a change", () => {
    assert.equal(g.hasRecentDirectionChange({ lastDirectionChangeTime: NOW() }), true);
  });

  it("false once the window has passed", () => {
    assert.equal(
      g.hasRecentDirectionChange({ lastDirectionChangeTime: NOW() - 10_000 }),
      false,
    );
  });
});

describe("isValidJump", () => {
  const enemy = { y: 300 };
  const base = () => ({
    isAboveGround: () => true,
    y: 100, // 100 < 300 - 20 -> above the enemy
    speedY: 0,
    lastDirectionChangeTime: NOW() - 10_000, // not a recent change
  });

  it("valid when airborne, above the enemy and falling", () => {
    assert.equal(g.isValidJump(base(), enemy), true);
  });

  it("invalid when not airborne", () => {
    assert.equal(g.isValidJump({ ...base(), isAboveGround: () => false }, enemy), false);
  });

  it("invalid when not above the enemy", () => {
    assert.equal(g.isValidJump({ ...base(), y: 290 }, enemy), false);
  });

  it("invalid when rising fast (speedY >= 5) without a recent direction change", () => {
    assert.equal(g.isValidJump({ ...base(), speedY: 20 }, enemy), false);
  });

  it("a recent direction change drops the falling requirement", () => {
    const c = { ...base(), speedY: 20, lastDirectionChangeTime: NOW() };
    assert.equal(g.isValidJump(c, enemy), true);
  });
});

describe("handleGlobalCooldown", () => {
  it("allows the first hit, blocks an immediate repeat, and stamps the time", () => {
    const character = { lastGlobalHitTime: 0 };
    assert.equal(g.handleGlobalCooldown(character, 1500), true);
    assert.ok(character.lastGlobalHitTime > 0);
    assert.equal(g.handleGlobalCooldown(character, 1500), false);
  });

  it("allows a hit again once the cooldown has elapsed", () => {
    const character = { lastGlobalHitTime: NOW() - 5_000 };
    assert.equal(g.handleGlobalCooldown(character, 1500), true);
  });
});

describe("handleEnemySpecificCooldown", () => {
  it("tracks cooldown per enemy instance", () => {
    const character = { hitByEnemies: new Map() };
    const bossA = new Endboss();
    const bossB = new Endboss();

    assert.equal(g.handleEnemySpecificCooldown(character, bossA, 3000), true);
    assert.equal(g.handleEnemySpecificCooldown(character, bossA, 3000), false);
    // a different instance is still on its own fresh cooldown
    assert.equal(g.handleEnemySpecificCooldown(character, bossB, 3000), true);
  });
});

describe("shouldApplyCollisionDamage", () => {
  it("is blocked briefly after a jump kill", () => {
    const character = {
      lastJumpKillTime: NOW(),
      hitByEnemies: new Map(),
      lastGlobalHitTime: 0,
    };
    assert.equal(g.shouldApplyCollisionDamage(character, new Chicken()), false);
  });

  it("uses the global cooldown path for regular enemies", () => {
    const character = {
      lastJumpKillTime: 0,
      hitByEnemies: new Map(),
      lastGlobalHitTime: 0,
    };
    assert.equal(g.shouldApplyCollisionDamage(character, new Chicken()), true);
    assert.equal(g.shouldApplyCollisionDamage(character, new Chicken()), false);
  });

  it("uses the per-instance cooldown path for the endboss", () => {
    const character = {
      lastJumpKillTime: 0,
      hitByEnemies: new Map(),
      lastGlobalHitTime: 0,
    };
    const boss = new Endboss();
    assert.equal(g.shouldApplyCollisionDamage(character, boss), true);
    assert.equal(g.shouldApplyCollisionDamage(character, boss), false);
    // the global timer was never touched by the endboss path
    assert.equal(character.lastGlobalHitTime, 0);
  });
});

describe("checkCollectible", () => {
  it("collects only the overlapped, not-yet-collected items and removes them", () => {
    const character = box(100, 100, 100, 200);
    const hit = { ...box(120, 120, 100, 100), constructor: { name: "Coin" } };
    const miss = { ...box(900, 120, 100, 100), constructor: { name: "Coin" } };
    const items = [hit, miss];

    let collected = 0;
    let sounds = 0;
    const out = g.checkCollectible(character, items, () => collected++, () => sounds++);

    assert.equal(collected, 1);
    assert.equal(sounds, 1);
    assert.equal(hit.isCollected, true);
    assert.deepEqual(out, [miss]);
    assert.equal(items.length, 1); // mutated in place
  });

  it("ignores an item already flagged as collected", () => {
    const character = box(100, 100, 100, 200);
    const already = {
      ...box(120, 120, 100, 100),
      constructor: { name: "Coin" },
      isCollected: true,
    };
    let collected = 0;
    const out = g.checkCollectible(character, [already], () => collected++, () => {});
    assert.equal(collected, 0);
    assert.deepEqual(out, [already]);
  });
});

describe("filterMarkedObjects", () => {
  it("drops objects marked for removal, keeps the rest, returns a new array", () => {
    const keep1 = { id: 1 };
    const keep2 = { id: 2 };
    const input = [keep1, { id: 3, markedForRemoval: true }, keep2];
    const out = g.filterMarkedObjects(input);
    assert.deepEqual(out, [keep1, keep2]);
    assert.notEqual(out, input);
  });
});
