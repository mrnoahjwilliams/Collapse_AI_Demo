let game;
let aiDepth = 4;
let gridSize = 5;

function setup() {
  createCanvas(600, 600);
  createUIControls(startGame);
  startGame(5, 5);
}

function draw() {
  background(255);
  if (game) {
    game.draw();
  }
}

function mousePressed() {
  game.handleClick(mouseX, mouseY);
}

function startGame(gridSize, aiDepth) {
  game = new Game(gridSize, aiDepth);
  loop();
}
