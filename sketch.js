let game;
let aiDepth = 4;
let gridSize = 5;

function setup() {
  createCanvas(600, 600);
  game = new Game(gridSize, aiDepth);
}

function draw() {
  background(255);
  game.draw();
}

function mousePressed() {
  game.handleClick(mouseX, mouseY);
}
