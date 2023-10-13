let shooterPositions = [];
let shootingIndex = [];
let moveIndex = -1;
let numberOfShooters = 7;
let alive;
let dead;

const container = 'high-noon-container';

function setup() {
  let canvas = createCanvas(1200, 756);
  canvas.parent(container);

  for (let i = 0; i < numberOfShooters; i++) {
    shooterPositions[i] = new p5.Vector(random(width), random(height));
  }
  calcShooting();
  
  let incrementButton = createButton('+1');
  incrementButton.position(-60, 0);
  incrementButton.size(50, 50);
  incrementButton.style('font-weight', 'bold');
  incrementButton.parent(container);
  incrementButton.mousePressed(incrementNumberOfShooters);
  
  let decrementButton = createButton('-1');
  decrementButton.position(-60, 75);
  decrementButton.size(50, 50);
  decrementButton.style('font-weight', 'bold');
  decrementButton.parent(container);
  decrementButton.mousePressed(decrementNumberOfShooters);
  
  noLoop();
}

function draw() {
  background(255);
  
  // draw arrows
  stroke(0, 0, 0, 150);
  fill(0);
  for (let i = 0; i < numberOfShooters; i++) {
    let shooterPosition = shooterPositions[i];
    let targetPosition = shooterPositions[shootingIndex[i]];
    let shootDirection = p5.Vector.sub(targetPosition, shooterPosition);
  
    push();
    translate(shooterPosition.x, shooterPosition.y);
    // draw arrow
    line(0, 0, shootDirection.x, shootDirection.y);
    arrowHead(createVector(0, 0), shootDirection);
    pop();
  }
  
  // draw points
    stroke(0);
  fill(175);
  for (let i = 0; i < numberOfShooters; i++) {
    let shooterPosition = shooterPositions[i];
    circle(shooterPosition.x, shooterPosition.y, 15);
  }
  
  // draw crosses
  for (let i = 0; i < numberOfShooters; i++) {
    let targetPosition = shooterPositions[shootingIndex[i]];
    
    push();
    translate(targetPosition.x, targetPosition.y);
    line(-5, -5, 5, 5);
    line(-5, 5, 5, -5);
    pop();
  }
  
  // draw text
  stroke(255);
  fill(0);
  text("total: " + numberOfShooters, 50, 15);
  text("alive: " + alive, 200, 15);
  text("dead: " + dead, 350, 15);
}

// credit: https://editor.p5js.org/kevinhb92/sketches/zLDDLrg_
function arrowHead(start, vector) {
  push();
  let norm = createVector(vector.x, vector.y);
  norm.normalize();

  applyMatrix(norm.x, norm.y, -norm.y, norm.x, vector.x - start.x, vector.y - start.y);
  triangle(-16, 8, -8, 0, -16, -8);
  pop();
}

function incrementNumberOfShooters() {
  if (numberOfShooters >= 100) {
    return;
  }
  numberOfShooters++;
  shooterPositions.push(new p5.Vector(random(width), random(height)));
  shootingIndex.push(-1);
  calcShooting();
  redraw();
}

function decrementNumberOfShooters() {
  if (numberOfShooters <= 2) {
    return;
  }
  numberOfShooters--;
  shooterPositions.pop();
  shootingIndex.pop();
  calcShooting();
  redraw();
}

function calcShooting() {
  for (let i = 0; i < numberOfShooters; i++) {
    let minDistance = width + height;
    let index = -1;
    for (let j = 0; j < numberOfShooters; j++) { 
      if (i == j) {
        continue;
      }
      let distance = shooterPositions[i].dist(shooterPositions[j]);
       if (distance < minDistance) {
         minDistance = distance;
         index = j;
       }
    }
    shootingIndex[i] = index;
  }
  
  dead = [... new Set(shootingIndex)].length;
  alive = numberOfShooters - dead;
}

function mousePressed() {
  let mouseVec = createVector(mouseX, mouseY);
  for (let i = 0; i < numberOfShooters; i++) {
   if (shooterPositions[i].dist(mouseVec) < 15) {
     moveIndex = i;
     return;
   }
  }
}

function mouseDragged() {
  if (moveIndex == -1) {
    return;
  }
  shooterPositions[moveIndex].x = constrain(mouseX, 0, width);
  shooterPositions[moveIndex].y = constrain(mouseY, 0, height);
  calcShooting();
  redraw();
}

function mouseReleased() {
  moveIndex = -1;
}