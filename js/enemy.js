/* =====================================================================
   enemy.js -- RED ROLLERS AND THEIR BURST LASERS.
   ===================================================================== */

var Enemy = {
  rollers: [],
  lasers: []
};

Enemy.reset = function () {
  Enemy.rollers = [];
  Enemy.lasers = [];

  // Only two enemies total.
  var worldWidth = Level.pixelWidth();
  var spawnXs = [Math.min(540, worldWidth - 220), Math.min(1120, worldWidth - 120)];
  for (var i = 0; i < spawnXs.length; i++) {
    Enemy.rollers.push({
      x: spawnXs[i],
      y: 0,
      vx: -CONFIG.ENEMY_SPEED,
      vy: 0,
      width: CONFIG.ENEMY_SIZE,
      height: CONFIG.ENEMY_SIZE,
      angle: 0,
      shotTimer: CONFIG.ENEMY_SHOT_DELAY + i * 40
    });
  }
};

Enemy.update = function () {
  for (var i = 0; i < Enemy.rollers.length; i++) {
    var roller = Enemy.rollers[i];
    var direction = Player.x >= roller.x ? -1 : 1;
    roller.vx = direction * CONFIG.ENEMY_SPEED;

    roller.vy += CONFIG.GRAVITY;
    if (roller.vy > CONFIG.MAX_FALL) { roller.vy = CONFIG.MAX_FALL; }

    Enemy.moveRoller(roller);

    roller.shotTimer--;
    if (roller.shotTimer <= 0) {
      Enemy.fireBurst(roller);
      roller.shotTimer = CONFIG.ENEMY_SHOT_INTERVAL;
    }
  }

  for (var j = Enemy.lasers.length - 1; j >= 0; j--) {
    var laser = Enemy.lasers[j];
    laser.x += laser.vx;
    laser.life--;

    if (laser.life <= 0 || Collide.hitsSolid(laser.x, laser.y, laser.width, laser.height)) {
      Enemy.lasers.splice(j, 1);
    }
  }
};

Enemy.moveRoller = function (roller) {
  var stepX = roller.vx < 0 ? -1 : 1;
  for (var i = 0; i < Math.abs(roller.vx); i++) {
    if (Collide.hitsSolid(roller.x + stepX, roller.y, roller.width, roller.height)) {
      roller.vx *= -1;
      break;
    }
    roller.x += stepX;
    roller.angle += stepX / CONFIG.ENEMY_RADIUS;
  }

  var stepY = roller.vy < 0 ? -1 : 1;
  for (var j = 0; j < Math.abs(roller.vy); j++) {
    if (Collide.hitsSolid(roller.x, roller.y + stepY, roller.width, roller.height)) {
      roller.vy = 0;
      break;
    }
    roller.y += stepY;
  }
};

// Fire three red lasers in a short burst aimed horizontally at the player.
Enemy.fireBurst = function (roller) {
  var direction = Player.x < roller.x ? -1 : 1;
  for (var i = 0; i < CONFIG.LASERS_PER_BURST; i++) {
    Enemy.lasers.push({
      x: roller.x + (direction < 0 ? 0 : roller.width),
      y: roller.y + roller.height / 2 - CONFIG.LASER_HEIGHT / 2 + (i - 1) * 8,
      width: CONFIG.LASER_WIDTH,
      height: CONFIG.LASER_HEIGHT,
      vx: direction * CONFIG.LASER_SPEED,
      life: CONFIG.LASER_LIFE
    });
  }
};

Enemy.hitsPlayer = function () {
  for (var i = 0; i < Enemy.rollers.length; i++) {
    var roller = Enemy.rollers[i];
    if (Enemy.overlaps(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE,
                       roller.x, roller.y, roller.width, roller.height)) {
      return true;
    }
  }

  for (var j = 0; j < Enemy.lasers.length; j++) {
    var laser = Enemy.lasers[j];
    if (Enemy.overlaps(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE,
                       laser.x, laser.y, laser.width, laser.height)) {
      return true;
    }
  }
  return false;
};

Enemy.overlaps = function (aX, aY, aW, aH, bX, bY, bW, bH) {
  return aX < bX + bW && aX + aW > bX &&
         aY < bY + bH && aY + aH > bY;
};
