import { animation } from "./DrawingRobotSimulation.js";

function drawSquare(xPosition, yPosition, size, rotation = 1) {
  this.origin = { x: xPosition, y: yPosition };
  this.size = size;
  this.rotation = rotation;
  this.numberOfIndexes = 5;

  animation.figureNumberOfIndexes = this.numberOfIndexes;

  const halfSize = this.size * 0.5;

  this.calculatePointFromIndex = (index) => {
    switch (index) {
      case 1:
        return { x: this.origin.x + halfSize, y: this.origin.y - halfSize };
      case 2:
        return { x: this.origin.x + halfSize, y: this.origin.y + halfSize };
      case 3:
        return { x: this.origin.x - halfSize, y: this.origin.y + halfSize };
      default:
        return { x: this.origin.x - halfSize, y: this.origin.y - halfSize };
    }
  };
}

export { drawSquare };
