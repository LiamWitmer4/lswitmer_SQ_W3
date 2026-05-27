// =============================
// SIMPLE PORTAL FIGHT GAME
// =============================

let PunchSound, VictorySound, BackgroundSound;

class Fighter {
  constructor(x, y, colour, leftKey, rightKey, attackKey) {
    this.x = x;
    this.y = y;

    this.colour = colour;

    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.attackKey = attackKey;

    this.health = 3;
    this.speed = 4;

    this.attacking = false;
  }

  update() {
    if (keyIsDown(this.leftKey)) this.x -= this.speed;
    if (keyIsDown(this.rightKey)) this.x += this.speed;

    this.x = constrain(this.x, 25, width - 25);
  }

  draw() {
    fill(this.colour);
    ellipse(this.x, this.y, 50);

    if (this.attacking) {
      fill(255);
      rect(this.x + 20, this.y - 5, 20, 10);
    }
  }

  attack(other) {
    this.attacking = true;

    PunchSound.play();

    if (abs(this.x - other.x) < 80) {
      other.health--;
    }

    setTimeout(() => {
      this.attacking = false;
    }, 120);
  }
}

let fighter1, fighter2;

let gameState = "start";
let winner = "";

function preload() {
  PunchSound = loadSound("assets/sounds/PunchSound.mp3");
  VictorySound = loadSound("assets/sounds/VictorySound.mp3");
  BackgroundSound = loadSound("assets/sounds/BackgroundSound.mp3");
}

function setup() {
  createCanvas(800, 450);

  BackgroundSound.loop();

  fighter1 = new Fighter(200, 300, color(0, 150, 255), 65, 68, 70);
  fighter2 = new Fighter(600, 300, color(255, 140, 0), LEFT_ARROW, RIGHT_ARROW, 75);
}

function draw() {
  background(20);

  // START SCREEN
  if (gameState === "start") {
    fill(255);
    textAlign(CENTER);

    textSize(50);
    text("PORTAL BRAWL", width / 2, height / 2 - 40);

    textSize(20);
    text("Press ENTER to Start", width / 2, height / 2 + 20);

    return;
  }

  // ground
  fill(180);
  rect(0, 350, width, 100);

  // FIGHT
  if (gameState === "fight") {
    fighter1.update();
    fighter2.update();

    if (fighter1.health <= 0) {
      winner = "Orange Wins!";
      gameState = "win";
      VictorySound.play();
    }

    if (fighter2.health <= 0) {
      winner = "Blue Wins!";
      gameState = "win";
      VictorySound.play();
    }
  }

  fighter1.draw();
  fighter2.draw();

  // UI
  fill(255);
  textSize(18);

  textAlign(LEFT);
  text("Blue HP: " + fighter1.health, 20, 40);

  textAlign(RIGHT);
  text("Orange HP: " + fighter2.health, width - 20, 40);

  textSize(12);

  textAlign(LEFT);
  text("A/D Move  F Attack", 20, 70);

  textAlign(RIGHT);
  text("Arrows Move  K Attack", width - 20, 70);

  // WIN SCREEN
  if (gameState === "win") {
    fill(0, 180);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER);

    textSize(40);
    text(winner, width / 2, height / 2);

    textSize(18);
    text("Press ENTER to Restart", width / 2, height / 2 + 40);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === "start" || gameState === "win") {
      fighter1.health = 3;
      fighter2.health = 3;

      fighter1.x = 200;
      fighter2.x = 600;

      gameState = "fight";
    }
  }

  if (gameState === "fight") {
    if (keyCode === 70) fighter1.attack(fighter2);
    if (keyCode === 75) fighter2.attack(fighter1);
  }
}