
const display = {
    ctx: undefined,
    otx: undefined,
    canvasHeight: 540,
    canvasWidth: 720
}

const animation = {
    previousTimestamp: undefined,
    stepSize: 1,
    pulseInterval: 500,
    pulseMultiplier: 1,
    penDown: false,
    targetPointIndex: 0,
    running: true,
    perviousPoint: { x: 0, y: 0 },
    targetPoints: [{ x: 150, y: 300 }, { x: 300, y: 300 }, { x: 325, y: 400 }, { x: 50, y: 50 }, { x: 75, y: 150 }, { x: 300, y: 300 }, { x: 325, y: 400 }, { x: 400, y: 400 }]
}

const limbPosition = { x: 0, y: 0, xDirection: 1, yDirection: 1 };

const bresenham = {
    err: 0,

    dx: 0,
    dy: 0,
}

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

        //window.requestAnimationFrame((t) => draw(t));
        //runAlgorithm(animation.targetPoints);

        onStartup();
        window.requestAnimationFrame((t) => mainLoop(t));
    }
}

const machine = {
    currentPosition: { x: 0, y: 0 },
    direction: { x: 1, y: 1 }
}

function turnStepperX() {
    machine.currentPosition.x += machine.direction.x;
}

function turnStepperY() {
    machine.currentPosition.y += machine.direction.y;
}


function onStartup() {
    setupBresenhamForPoint();
}

function mainLoop(timeStamp) {

    if (machine.currentPosition.x === animation.targetPoints[animation.targetPointIndex].x && machine.currentPosition.y === animation.targetPoints[animation.targetPointIndex].y) {
        updateParameters();
    }

    if (animation.running) {

        if (timeStamp >= animation.pulseInterval) {

            const err2 = 2 * bresenham.err;

            if (err2 >= bresenham.dy) {
                bresenham.err = bresenham.err + bresenham.dy;

                if (machine.currentPosition.x !== animation.targetPoints[animation.targetPointIndex].x) {
                    turnStepperX();
                }
            }
            if (err2 <= bresenham.dx) {
                bresenham.err = bresenham.err + bresenham.dx;

                if (machine.currentPosition.y !== animation.targetPoints[animation.targetPointIndex].y) {
                    turnStepperY();
                }
            }
            console.log(machine.currentPosition);

            drawInFunction();

        }

        window.requestAnimationFrame((t) => mainLoop(t));
    }


}

function updateParameters() {

    if (animation.targetPointIndex < animation.targetPoints.length - 1) {
        animation.targetPointIndex++;
        setupBresenhamForPoint();
        changeDirection();
        if (animation.targetPointIndex > 0 && !animation.penDown) {
            lowerPen();
        }
        console.log(bresenham.dx, bresenham.dy, bresenham.err);
    } else {
        animation.running = false;
    }
}

function setupBresenhamForPoint() {

    bresenham.dx = Math.abs(animation.targetPoints[animation.targetPointIndex].x - machine.currentPosition.x);
    bresenham.dy = -Math.abs(animation.targetPoints[animation.targetPointIndex].y - machine.currentPosition.y);
    bresenham.err = 0;

}

function changeDirection() {
    const xDifference = animation.targetPoints[animation.targetPointIndex].x >= machine.currentPosition.x;

    if (xDifference && machine.direction.x === -1) {
        machine.direction.x = machine.direction.x * -1;
    }
    if (!xDifference && machine.direction.x === 1) {
        machine.direction.x = machine.direction.x * -1;
    }

    const yDifference = animation.targetPoints[animation.targetPointIndex].y >= machine.currentPosition.y;

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
    display.otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

}






function drawInFunction() {
    clearOtx();
    drawLimbs();
    if (animation.penDown) drawTo();

}

function endDraw() {
    if ((limbPosition.y === animation.targetPoints[0].y && limbPosition.x === animation.targetPoints[0].x) || limbPosition.x >= display.canvasWidth || limbPosition.y >= display.canvasHeight) {
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
    display.otx.fillRect(machine.currentPosition.x, machine.currentPosition.y, 16, 16);

}

function raisePen() {
    animation.penDown = false;
    display.otx.beginPath();
}

function lowerPen() {
    animation.penDown = true;
}

function drawTo() {
    display.ctx.lineTo(machine.currentPosition.x + 8, machine.currentPosition.y + 8);
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
