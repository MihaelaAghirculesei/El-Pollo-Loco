import js from "@eslint/js";
import globals from "globals";

/**
 * Identifiers that are defined in one script file and consumed in another.
 * The game loads every class and helper as a plain `<script>`, so from
 * ESLint's point of view they are ambient browser globals.
 */
const gameGlobals = {
  // entities and infrastructure
  DrawableObject: "readonly",
  MovableObject: "readonly",
  Character: "readonly",
  Endboss: "readonly",
  Chicken: "readonly",
  SmallChicken: "readonly",
  Cloud: "readonly",
  Bottle: "readonly",
  Coin: "readonly",
  ThrowableObject: "readonly",
  BackgroundObjekt: "readonly",
  CollectableObject: "readonly",
  Keyboard: "readonly",
  Level: "readonly",
  World: "readonly",
  buildLevel1: "readonly",
  warmSpritePool: "readonly",
  StatusBarHeartCharacter: "readonly",
  StatusBarHeartEndboss: "readonly",
  StatusBarBottle: "readonly",
  StatusBarCoins: "readonly",
  // audio
  AudioManager: "readonly",
  audioManager: "readonly",
  isGameMuted: "writable",
  // game-end / collision helpers (game-utils.class.js)
  checkGameEnd: "readonly",
  showGameOver: "readonly",
  showGameWon: "readonly",
  isCollidingWithEnemy: "readonly",
  isCollidingWithItem: "readonly",
  isBottleHittingEnemy: "readonly",
  isValidJump: "readonly",
  shouldApplyCollisionDamage: "readonly",
  checkCollectible: "readonly",
  filterMarkedObjects: "readonly",
  showCongratulations: "readonly",
  clearCanvas: "readonly",
  flipImage: "readonly",
  flipImageBack: "readonly",
  // audio helper wrappers (game-utils.class.js)
  playSound: "readonly",
  playCharacterSnoringSound: "readonly",
  stopCharacterSnoringSound: "readonly",
  playBackgroundMusic: "readonly",
  stopBackgroundMusic: "readonly",
  playEndbossAttackMusic: "readonly",
  stopEndbossAttackMusic: "readonly",
  playNewLifeSound: "readonly",
  playEnemyHurtSound: "readonly",
  playCharacterHurtSound: "readonly",
  playGameOverSound: "readonly",
  playGameWonSound: "readonly",
  playCoinCollectSound: "readonly",
  playBottleCollectSound: "readonly",
  stopAllGameEndSounds: "readonly",
  toggleSound: "readonly",
  enableAllSounds: "readonly",
  disableAllSounds: "readonly",
  muteAllSounds: "readonly",
  playEndbossHurtSound: "readonly",
  playEndbossAttackSound: "readonly",
  // game.js entry points wired from index.html
  startGame: "readonly",
  showFooterOnGameEnd: "readonly",
};

export default [
  { ignores: ["dist/**"] },
  js.configs.recommended,
  {
    files: ["js/**/*.js", "models/**/*.js", "levels/**/*.js", "fonts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...gameGlobals },
    },
    rules: {
      // The cross-file globals pattern makes whole-program unused analysis
      // unreliable, so scope it to locals, params and destructuring.
      "no-unused-vars": [
        "warn",
        { vars: "local", args: "after-used", caughtErrors: "none" },
      ],
      // Each class/helper listed in `gameGlobals` is *defined* in one of these
      // files; that definition is not a redeclaration of the ambient name.
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
  {
    // The only two files that are real ES modules.
    files: ["js/game.js", "models/world.class.js"],
    languageOptions: { sourceType: "module" },
  },
  {
    // Node test suite — CommonJS, run by `node --test`, never shipped.
    files: ["test/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
  },
  {
    // E2E smoke test also runs code inside the browser page (page.evaluate,
    // waitForFunction), so it needs the browser globals too.
    files: ["test/e2e/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    // Build script — an ES-module Node script.
    files: ["build.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
