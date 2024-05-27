//import { drawSquare } from "./drawSquare.js";

const display = {
  ctx: undefined,
  otx: undefined,
  canvasHeight: 540,
  canvasWidth: 720,
};

const machine = {
  currentPosition: { x: 0, y: 0 },
  direction: { x: 1, y: 1 },
};

const animation = {
  previousTimestamp: 0,
  stepSize: 1,
  pulseInterval: 5,
  pulseMultiplier: 1,
  pulseHigh: 0,
  penDown: false,
  targetPointIndex: 0,
  running: true,
  perviousPoint: { x: 0, y: 0 },
  figureIndex: 0,
  figureNumberOfIndexes: 0,
  figureStack: [],
  targetPoint: { x: 0, y: 0 },
};

function drawSquare(xPosition, yPosition, lengthOfSide) {
  const numberOfIndexes = 5;

  animation.figureStack.push({
    numberOfIndexes: numberOfIndexes,
    figureType: "square",
    x: xPosition,
    y: yPosition,
    calculatePointFromIndex: function (index) {
      const origin = { x: xPosition, y: yPosition };
      const size = lengthOfSide;
      const halfSize = Math.ceil(size * 0.5);

      switch (index) {
        case 1:
          return { x: origin.x + halfSize, y: origin.y - halfSize };
        case 2:
          return { x: origin.x + halfSize, y: origin.y + halfSize };
        case 3:
          return { x: origin.x - halfSize, y: origin.y + halfSize };
        default:
          return { x: origin.x - halfSize, y: origin.y - halfSize };
      }
    },
  });
}

function drawCircle(xPosition, yPosition, radius, precision = 36) {
  animation.figureStack.push({
    numberOfIndexes: precision + 1,
    figureType: "circle",
    x: xPosition,
    y: yPosition,
    calculatePointFromIndex: function (index) {
      const origin = { x: xPosition, y: yPosition };
      const r = radius;
      const stepSize = 360 / precision;
      const step = (Math.PI / 180) * stepSize;

      return {
        x: Math.ceil(Math.cos(index * step) * r) + origin.x,
        y: Math.ceil(Math.sin(index * step) * r) + origin.y,
      };
    },
  });
}

//function tPSquare(xPosition, yPosition, size, rotation = 1) {
//  this.origin = { x: xPosition, y: yPosition };
//  this.size = size;
//  this.rotation = rotation;
//  this.numberOfIndexes = 5;
//
//  animation.figureNumberOfIndexes = this.numberOfIndexes;
//
//  const halfSize = this.size * 0.5;
//
//  this.calculatePointFromIndex = (index) => {
//    switch (index) {
//      case 1:
//        return { x: this.origin.x + halfSize, y: this.origin.y - halfSize };
//      case 2:
//        return { x: this.origin.x + halfSize, y: this.origin.y + halfSize };
//      case 3:
//        return { x: this.origin.x - halfSize, y: this.origin.y + halfSize };
//      default:
//        return { x: this.origin.x - halfSize, y: this.origin.y - halfSize };
//    }
//  };
//}
/*
function tPSquare(xPosition, yPosition, size, rotation = 90) {
  this.origin = { x: xPosition, y: yPosition };
  this.size = size;
  this.rotation = rotation;
  this.numberOfIndexes = 5;

  animation.figureNumberOfIndexes = this.numberOfIndexes;

  let stepSize = 360 / rotation;
  let step = (Math.PI / 180) * stepSize;

  const halfSize = this.size * 0.5;

  this.calculatePointFromIndex = (index) => {
    switch (index) {
      case 1:
        return {
          x:
            this.origin.x +
            halfSize +
            Math.round(Math.cos(step) * halfSize) -
            Math.round(Math.sin(step) * halfSize),
          y:
            this.origin.y -
            halfSize +
            Math.round(Math.sin(step) * halfSize) +
            Math.round(Math.cos(step) * halfSize),
        };
      case 2:
        return {
          x:
            this.origin.x +
            halfSize +
            Math.round(Math.cos(step) * halfSize) -
            Math.round(Math.sin(step) * halfSize),
          y:
            this.origin.y +
            halfSize +
            Math.round(Math.sin(step) * halfSize) +
            Math.round(Math.cos(step) * halfSize),
        };
      case 3:
        return {
          x:
            this.origin.x -
            halfSize +
            Math.round(Math.cos(step) * halfSize) -
            Math.round(Math.sin(step) * halfSize),
          y:
            this.origin.y +
            halfSize +
            Math.round(Math.sin(step) * halfSize) +
            Math.round(Math.sin(step) * halfSize),
        };
      default:
        return {
          x:
            this.origin.x -
            halfSize +
            Math.round(Math.cos(step) * halfSize) -
            Math.round(Math.sin(step) * halfSize),
          y:
            this.origin.y -
            halfSize +
            Math.round(Math.sin(step) * halfSize) +
            Math.round(Math.sin(step) * halfSize),
        };
    }
  };
}
*/
function tPCircle(xPosition, yPosition, radius, fidelity = 36) {
  this.origin = { x: xPosition, y: yPosition };
  this.radius = radius;
  this.numberOfIndexes = fidelity + 1;

  this.stepSize = 360 / fidelity;
  this.step = (Math.PI / 180) * this.stepSize;

  animation.figureNumberOfIndexes = this.numberOfIndexes;

  this.calculatePointFromIndex = (index) => {
    return {
      x: Math.round(Math.cos(index * this.step) * this.radius) + this.origin.x,
      y: Math.round(Math.sin(index * this.step) * this.radius) + this.origin.y,
    };
  };
}

/* TEST ARRAY:
,
    { x: 150, y: 300 },
    { x: 300, y: 300 },
    { x: 325, y: 400 },
    { x: 50, y: 50 },
    { x: 75, y: 150 },
    { x: 300, y: 300 },
    { x: 325, y: 400 },
    { x: 400, y: 400 },

*/

const bresenham = {
  err: 0,
  dx: 0,
  dy: 0,
};

// function makeSquare(position, sideLength) {
//   const sideLengthEvenizer = (sideL) => (sideL % 2 === 0 ? sideL : sideL + 1);
//
//   const furtherByHalf = position + sideLengthEvenizer(sideLength) / 2;
//   const closerByHalf = position - sideLengthEvenizer(sideLength) / 2;
//
//   return [
//     { x: closerByHalf, y: closerByHalf },
//     { x: furtherByHalf, y: closerByHalf },
//     { x: furtherByHalf, y: furtherByHalf },
//     { x: closerByHalf, y: furtherByHalf },
//     { x: closerByHalf, y: closerByHalf },
//   ];
// }

function main() {
  const canvas = document.getElementById("base");
  const overlayCanvas = document.getElementById("overlay");

  canvas.height = display.canvasHeight;
  canvas.width = display.canvasWidth;

  overlayCanvas.height = display.canvasHeight;
  overlayCanvas.width = display.canvasWidth;

  if (canvas.getContext) {
    display.ctx = canvas.getContext("2d");
    display.otx = overlayCanvas.getContext("2d");

    initialDraw();
    onStartup();
    window.requestAnimationFrame((t) => mainLoop(t));
  }
}
//animation.figureStack.push(new tPSquare(200, 200, 100));
//drawCircle(display.canvasWidth / 2, display.canvasHeight / 2, 250);

function onStartup() {
  drawCircle(400, 270, 100);
  drawCircle(240, 220, 100);
  //drawSquare(200, 200, 100);
  //drawSquare(300, 100, 200);
  setNewTargetPoint();
  checkFigureStack();
  setupBresenhamForPoint();
}

function turnStepperX() {
  machine.currentPosition.x += machine.direction.x * animation.stepSize;
}

function turnStepperY() {
  machine.currentPosition.y += machine.direction.y * animation.stepSize;
}
//    new tPCircle(200, 100, 50),
//    new tPCircle(200, 300, 50),
//    new tPCircle(100, 200, 50),
//    new tPCircle(300, 200, 50),
//    new tPSquare(400, 400, 200)  //animation.figureStack.push(
//  new tPCircle(display.canvasWidth / 2, display.canvasHeight / 2, 250)
//);

//  console.log(
//    "x posisjon:",
//    machine.currentPosition.x,
//    "y-posisjon:",
//    machine.currentPosition.y,
//    "nåværende punkt index:",
//    animation.targetPointIndex,
//    "nåværende figur index:",
//    animation.figureIndex
//  );

function checkFigureStack() {
  animation.running = animation.figureStack.length > 0;
  animation.figureNumberOfIndexes =
    animation.figureStack[animation.figureIndex].numberOfIndexes;
}

function mainLoop(timeStamp) {
  if (
    machine.currentPosition.x === animation.targetPoint.x &&
    machine.currentPosition.y === animation.targetPoint.y
  ) {
    console.log("update params");
    updateParameters();
  }

  if (
    animation.running &&
    timeStamp - animation.previousTimestamp >= animation.pulseInterval
  ) {
    if (animation.pulseHigh === 0) {
      const err2 = 2 * bresenham.err;
      animation.previousTimestamp = timeStamp;

      if (err2 >= bresenham.dy) {
        bresenham.err = bresenham.err + bresenham.dy;

        if (machine.currentPosition.x !== animation.targetPoint.x) {
          turnStepperX();
        }
      }
      if (err2 <= bresenham.dx) {
        bresenham.err = bresenham.err + bresenham.dx;

        if (machine.currentPosition.y !== animation.targetPoint.y) {
          turnStepperY();
        }
      }

      drawInFunction();
      animation.pulseHigh = 1;
    } else {
      animation.pulseHigh = 0;
    }

    window.requestAnimationFrame((t) => mainLoop(t));
  }
}

function updateParameters() {
  if (animation.targetPointIndex < animation.figureNumberOfIndexes - 1) {
    animation.targetPointIndex++;
    setNewTargetPoint();
    setupBresenhamForPoint();
    changeDirection();
    if (animation.targetPointIndex > 0 && !animation.penDown) {
      lowerPen();
    }
  } else {
    raisePen();
    if (animation.figureIndex < animation.figureStack.length - 1) {
      animation.targetPointIndex = -1;
      animation.figureIndex++;
      animation.figureNumberOfIndexes =
        animation.figureStack[animation.figureIndex].numberOfIndexes;
    } else {
      animation.running = false;
    }
  }
}

function setNewTargetPoint() {
  animation.targetPoint = animation.figureStack[
    animation.figureIndex
  ].calculatePointFromIndex(animation.targetPointIndex);
}

function setupBresenhamForPoint() {
  bresenham.dx = Math.abs(animation.targetPoint.x - machine.currentPosition.x);
  bresenham.dy = -Math.abs(animation.targetPoint.y - machine.currentPosition.y);
  bresenham.err = bresenham.dx + bresenham.dy;
}

function changeDirection() {
  const xDifference = animation.targetPoint.x >= machine.currentPosition.x;

  if (xDifference && machine.direction.x === -1) {
    machine.direction.x = machine.direction.x * -1;
  }
  if (!xDifference && machine.direction.x === 1) {
    machine.direction.x = machine.direction.x * -1;
  }

  const yDifference = animation.targetPoint.y >= machine.currentPosition.y;

  if (yDifference && machine.direction.y === -1) {
    machine.direction.y = machine.direction.y * -1;
  }
  if (!yDifference && machine.direction.y === 1) {
    machine.direction.y = machine.direction.y * -1;
  }
}

function initialDraw() {
  display.ctx.lineWidth = 2;
  display.ctx.lineCap = "round";
  display.ctx.beginPath();

  display.otx.fillStyle = "rgb(50 200 0 / 20%)";
  display.otx.fillRect(...verticalLimb());
  display.otx.fillRect(...horizontalLimb());

  display.otx.fillStyle = "rgb(0 0 0 / 20%)";
  display.otx.fillRect(
    machine.currentPosition.x,
    machine.currentPosition.y,
    16,
    16
  );
}

function drawInFunction() {
  clearOtx();
  drawLimbs();
  if (animation.penDown) drawTo();
}

function endDraw() {
  if (
    (machine.currentPosition.y === animation.targetPoints[0].y &&
      machine.currentPosition.x === animation.targetPoints[0].x) ||
    machine.currentPosition.x >= display.canvasWidth ||
    machine.currentPosition.y >= display.canvasHeight
  ) {
    display.ctx.stroke();
    display.ctx.closePath();
  }
}

function clearOtx() {
  display.otx.clearRect(0, 0, display.canvasWidth, display.canvasHeight);
}

function drawLimbs() {
  display.otx.fillStyle = "rgb(50 200 0 / 20%)";
  display.otx.fillRect(...verticalLimb(machine.currentPosition.x));
  display.otx.fillRect(...horizontalLimb(machine.currentPosition.y));

  display.otx.fillStyle = "rgb(0 0 0 / 20%)";
  display.otx.fillRect(
    machine.currentPosition.x,
    machine.currentPosition.y,
    16,
    16
  );
}

function raisePen() {
  animation.penDown = false;
  display.ctx.beginPath();
}

function lowerPen() {
  animation.penDown = true;
  display.ctx.beginPath();
}

function drawTo() {
  display.ctx.lineTo(
    machine.currentPosition.x + 8,
    machine.currentPosition.y + 8
  );
  display.ctx.stroke();
}

function horizontalLimb() {
  const y = machine.currentPosition.y;
  const x = 0;

  const width = display.canvasWidth;
  const height = 16;

  return [x, y, width, height];
}

function verticalLimb() {
  const y = 0;
  const x = machine.currentPosition.x;

  const width = 16;
  const height = display.canvasHeight;

  return [x, y, width, height];
}

main();

export { animation };
