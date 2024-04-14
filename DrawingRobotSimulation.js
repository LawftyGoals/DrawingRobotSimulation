
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




function turnStepperMotors(x, y) {

    limbPosition.x += animation.pulseMultiplier * x * limbPosition.yDirection;
    limbPosition.y += animation.pulseMultiplier * y * limbPosition.yDirection;

}




function runAlgorithm(targetPoints) {

    const { x: targetX, y: targetY } = targetPoints[0];

    bresenham.x1 = Math.round(targetX);
    bresenham.y1 = Math.round(targetY);

    bresenham.dx = Math.abs(bresenham.x1 - bresenham.x0);
    bresenham.dy = -Math.abs(bresenham.y1 - bresenham.y0);

    bresenham.sx = bresenham.x0 < bresenham.x1 ? 1 : -1;
    bresenham.sy = bresenham.y0 < bresenham.y1 ? 1 : -1;


    window.requestAnimationFrame((t) => animate(t));
}

function animate(timestamp) {

    if (animation.previousTimestamp === undefined) animation.previousTimestamp = timestamp;
    const elapsed = timestamp - animation.previousTimestamp;

    if (elapsed >= animation.pulseInterval && bresenhamAlgorithm()) {

        if (bresenham.x_step < 0) {
            limbPosition.xDirection = -1;
        } else {
            limbPosition.xDirection = 1;
        }

        if (bresenham.y_step < 0) {
            limbPosition.yDirection = -1;
        } else {
            limbPosition.yDirection = 1;
        }

        turnStepperMotors(Math.abs(bresenham.x_step), Math.abs(bresenham.y_step))
        drawInFunction();

        if (animation.penDown) drawTo();
    }

    if ((limbPosition.y === animation.targetPoints[0].y && limbPosition.x === animation.targetPoints[0].x) || limbPosition.x >= display.canvasWidth || limbPosition.y >= display.canvasHeight) {
        endDraw();
    } else {
        window.requestAnimationFrame((t) => (animate(t)));

    }


}


function bresenhamAlgorithm() {
    const err2 = 2 * bresenham.err;
    bresenham.x_step = 0;
    bresenham.y_step = 0;

    if (bresenham.x0 === bresenham.x1 && bresenham.y0 === bresenham.y1) {
        return false;
    }
    if (err2 >= bresenham.dy) {

        bresenham.err = bresenham.err + bresenham.dy;
        if (bresenham.x0 === bresenham.x1) {
            return false;
        }
        // Update step and error

        if (bresenham.x0 !== bresenham.x1) {
            bresenham.x0 = bresenham.x0 + bresenham.sx;
            bresenham.x_step = bresenham.sx;
        }
    }
    if (err2 <= bresenham.dx) {
        if (bresenham.y0 === bresenham.y1) {
            return false;
        }
        bresenham.err = bresenham.err + bresenham.dx;
        bresenham.y0 = bresenham.y0 + bresenham.sy;
        bresenham.y_step = bresenham.sy;
    }

    return true;
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
