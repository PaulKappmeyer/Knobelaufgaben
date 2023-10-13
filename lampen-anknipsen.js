var s = function(sketch) {
  let numberOfLamps = 30;
  let lampPositions = [];
  let isOn = [];
  let buttons = [];
  let buttonPressed = [];
  let canvas;

  const lampSize = 50;
  const container = 'lampen-anknipsen-container';
  const buttonColor1 = sketch.color(25, 25, 200, 100);
  const buttonColor2 = sketch.color(200, 25, 25, 100);

  sketch.setup = function() {
    canvas = sketch.createCanvas(windowWidth-100, 300);
    canvas.parent(container);
    
    for(let i = 0; i < numberOfLamps; i++) {
      createLamp(i);
    }
    
    let incrementButton = sketch.createButton('+1');
    incrementButton.position(0, 0);
    incrementButton.size(50, 50);
    incrementButton.style('font-weight', 'bold');
    incrementButton.parent(container);
    incrementButton.mousePressed(incrementNumberOfLamps);
    
    let decrementButton = sketch.createButton('-1');
    decrementButton.position(75, 0);
    decrementButton.size(50, 50);
    decrementButton.style('font-weight', 'bold');
    decrementButton.parent(container);
    decrementButton.mousePressed(decrementNumberOfLamps);
    
    let resetButton = sketch.createButton('reset');
    resetButton.position(150, 0);
    resetButton.size(50, 50);
    resetButton.style('font-weight', 'bold');
    resetButton.parent(container);
    resetButton.mousePressed(reset);
    
    sketch.noLoop();
  }

  sketch.draw = function() {
    sketch.background(255);
    
    sketch.stroke(0);
    for(let i = 0; i < numberOfLamps; i++) {
      let lampPos = lampPositions[i];
      if (isOn[i]) {
        sketch.fill(255, 255, 0);
      } else {
        sketch.fill(100);
      }
      sketch.circle(lampPos.x, lampPos.y, lampSize);
    }
  }

  function createLamp(index) {
    let x = 5 + lampSize/2 + 1.1 * index * lampSize;
    let y = sketch.height/2;
    lampPositions[index] = new p5.Vector(x, y);
    isOn[index] = false;
      
    let button = createButton(str(index+1));
    button.position(x - lampSize/2, y + lampSize/2 + 5);
    button.size(lampSize, lampSize);
    button.style('background-color', buttonColor1);
    button.style('font-weight', 'bold');
    button.parent(container);
    button.mousePressed(() => onButtonPressed(index+1));
    buttons[index] = button;
    buttonPressed[index] = false;
  }

  function onButtonPressed(offset) {
    let index = offset-1;
    buttonPressed[index] = !buttonPressed[index];
    for(let i = index; i < numberOfLamps; i+=offset) {
      isOn[i] = !isOn[i];
    }
    if (buttonPressed[index]) {
      buttons[index].style('background-color', buttonColor2);
    } else {
      buttons[index].style('background-color', buttonColor1);
    }
    sketch.redraw();
  }

  function reset() {
    for(let i = 0; i < numberOfLamps; i++) {
      isOn[i] = false;
      buttons[i].style('background-color', buttonColor1);
    }
    sketch.redraw();
  }

  function incrementNumberOfLamps() {
    if (numberOfLamps >= 33) {
      return;
    }
    createLamp(numberOfLamps);
    numberOfLamps++;
    sketch.redraw();
  }

  function decrementNumberOfLamps() {
    if (numberOfLamps <= 1) {
      return;
    }
    numberOfLamps--;
    lampPositions.pop();
    isOn.pop();
    buttons.pop().remove();
    buttonPressed.pop();
    sketch.redraw();
  }
}

var lampenAnknipsenSktech = new p5(s);