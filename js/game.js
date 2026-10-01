/* =====================================================================
   game.js  --  THE RULES AND THE LOOP.
   ===================================================================== */

var Game = {
  mode: "playing",
  levelNumber: 0
};

Game.startLevel = function (levelNumber) {
  Game.levelNumber = levelNumber;
  Level.build(levelNumber);
  Player.reset();
  Enemy.reset();
  Game.mode = "playing";
  Game.showMessage("");
};

Game.showMessage = function (text) {
  document.getElementById("message").textContent = text;
};

Game.update = function () {
  if (Input.restart) {
    Game.startLevel(Game.levelNumber);
    return;
  }
  if (Input.nextLevel) {
    if (Game.levelNumber + 1 < Level.levels.length) {
      Game.startLevel(Game.levelNumber + 1);
    }
    return;
  }
  if (Game.mode !== "playing") { return; }

  Player.update();
  Enemy.update();

  if (Player.isDead()) {
    Game.mode = "dead";
    Game.showMessage("You hit something. Press R to try again.");
    return;
  }
  if (Player.hasWon()) {
    Game.mode = "won";
    Game.showMessage("You made it. Press N for next level or R to play again.");
  }
};

Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
