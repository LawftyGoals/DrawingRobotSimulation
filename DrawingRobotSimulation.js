
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
    penDown: true
}

const limbPosition = { x: 0, y: 0 };

//let targetIndex = 0;
const targetPoint = [{ x: 150, y: 300 }, { x: 300, y: 300 }, { x: 325, y: 400 }] //{ x: Math.floor(canvasWidth / 2), y: Math.floor(canvasHeight / 2) };

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

        window.requestAnimationFrame((t) => draw(t));

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

function draw(timestamp) {
    if (animation.previousTimestamp === undefined) animation.previousTimestamp = timestamp;

    const elapsed = timestamp - animation.previousTimestamp;


    if (elapsed >= animation.pulseInterval) {
        display.otx.clearRect(0, 0, display.canvasWidth, display.canvasHeight)
        turnStepperMotors();
        drawLimbs();
        if (animation.penDown) drawTo();
    }


    if ((limbPosition.y === targetPoint[0].y && limbPosition.x === targetPoint[0].x) || limbPosition.x >= display.canvasWidth || limbPosition.y >= display.canvasHeight) {
        display.ctx.stroke();
        display.ctx.closePath();
    } else {
        window.requestAnimationFrame((t) => (draw(t)));

    }
}


function drawLimbs() {
    display.otx.fillStyle = "rgb(50 200 0 / 20%)";
    display.otx.fillRect(...verticalLimb(limbPosition.x));
    display.otx.fillRect(...horizontalLimb(limbPosition.y));

    display.otx.fillStyle = "rgb(0 0 0 / 20%)";
    display.otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

}

function raisePen() {
    animation.penDown = false;
    display.otx.beginPath();
}

function lowerPen() {
    animation.penDown = true;
}

function drawTo() {
    display.ctx.lineTo(limbPosition.x + 8, limbPosition.y + 8);
    display.ctx.stroke();

}

function horizontalLimb() {
    const y = limbPosition.y;
    const x = 0;

    const width = display.canvasWidth;
    const height = 16;

    return [x, y, width, height];

}

function verticalLimb() {
    const y = 0;
    const x = limbPosition.x;

    const width = 16;
    const height = display.canvasHeight;

    return [x, y, width, height];

}


function turnStepperMotors() {

    const pulse = pulseGenerator();

    limbPosition.x += pulse.x ? getDirectionOfTurn(pulse.xDirection) : 0;
    limbPosition.y += pulse.y ? getDirectionOfTurn(pulse.yDirection) : 0;

}

function getDirectionOfTurn(direction) {
    return direction ? animation.stepSize : -animation.stepSize;
}

function pulseGenerator() {
    return { x: true, xDirection: true, y: true, yDirection: true };
}


/*
function moveTo() {
    let x_steps = targetX / (xCalibration / 10000);
    let y_steps = targetY / (yCalibration / 10000);

    x = Math.round(x_steps);
    y = Math.round(y_steps);

    runSteppersBresenham(x_steps, y_steps);

}



function runSteppersBresenham(targetX, targetY) {
    x1 = targetX;
    y1 = targetY;

    dx = Math.abs(x1 - x0);
    dy = -Math.abs(y1 - y0);

    sx = x0 < x1 ? 1 : -1;
    sy = y0 < y1 ? 1 : -1;

    while (bresenhamAlgorithm()) {

    }


}

function bresenhamAlgorith() {
    err2 = 2 * err;
    x_step = 0;
    y_step = 0;

    if (x0 === x1 && y0 === y1) {
        return false;
    }
    if (err2 >= dy) {
        if (x0 === x1) {
            return false;
        }
        // Update step and error
        err = err + dy;
        x0 = x0 + sx;
        x_step = sx;
    }
    if (err2 <= dx) {
        if (y0 === y1) {
            return false;
        }
        err = err + dx;
        y0 = y0 + sy;
        y_step = sy;
    }

    return true;
}
/*
void runSteppersBres(int targetX, int targetY) {
    // TargetX og targetY er i pixelverdier!!!!!!!
    // Coordinate system is 0,0 upper left!
    x1 = targetX;
    y1 = targetY;
    dx = abs(x1 - x0);
    dy = -abs(y1 - y0);
    err = dx + dy;
    String message = "dx, dy " + String(x1 - x0) + "," + String(y1 - y0);
    Serial.println(message);
    if (x0 < x1) {
        sx = 1;
    }
    else {
        sx = -1;
    }
    if (y0 < y1) {
        sy = 1;
    }
    else {
        sy = -1;
    }

    // Initializes the steps.
    isDrawing = bresenham(); // Updates global variables dx, dy to either +1, -1 or 0 for a step or not.
    // Start loop with intervals
    while (isDrawing) {
        if (micros() - lastTime >= timePerStep) {
            //Serial.print("pulseOn, dx, dy: ");
            //String str1 = String(pulseOn) + "," + String(dx) + "," + String(dy);
            //Serial.println(str1);
            if (pulseOn) {
                lastTime = micros();
                pulseOn = !pulseOn; // Flips logic.
                digitalWrite(stepXpin, LOW);
                digitalWrite(stepYpin, LOW);
                digitalWrite(xpDirLed, LOW);
                digitalWrite(xnDirLed, LOW);
            }
            else {
                lastTime = micros();
                if (x_step < 0) {
                    digitalWrite(dirXpin, HIGH); // CW
                    digitalWrite(xnDirLed, HIGH);
                }
                else {
                    digitalWrite(dirXpin, LOW); // CCW
                    digitalWrite(xpDirLed, HIGH);
                }
                if (y_step < 0) {
                    digitalWrite(dirYpin, LOW); // CCW
                }
                else {
                    digitalWrite(dirYpin, HIGH); // CW
                }
                if (x_step == 0) {
                    digitalWrite(xpDirLed, LOW);
                    digitalWrite(xnDirLed, LOW);
                }
                digitalWrite(stepXpin, abs(x_step)); // writes either a 1 (HIGH) or 0 (LOW) dependent on result from bresenham. dx can be +1, -1, 0.
                digitalWrite(stepYpin, abs(y_step));
                pulseOn = !pulseOn; // flips logic
                delayMicroseconds(5);
                // Turns off the pulse after 50 microseconds
                digitalWrite(stepXpin, LOW);
                digitalWrite(stepYpin, LOW);
                // Calculate next step while we wait for pulse to become low
                isDrawing = bresenham();
            }
        }

    } // END while (isDrawing)
    /*
    Serial.println("Finished line");
    Serial.print("Updatet stepper coordinates: x0,y0: ");
    Serial.print(x0);
    Serial.print(",");
    Serial.println(y0);
    */
/*
}
  
  bool bresenham() {
    // Calculates steps in x and y directions. 0, -1 or 1
    // Updates global variables dx, dy, and error variable err.


}

void setAbsoluteCoordinates(float x_mm, float y_mm) {
    // Sets pixel values x0 and y0 from millimeter coordinates.
    float x_steps = x_mm / (xCalibration / 5000);
    x0 = round(x_steps);
    float y_steps = y_mm / (yCalibration / 5000);
    y0 = round(y_steps);
    String str4 = "Head position after manual override: x0,y0: " + String(x0) + "," + String(y0);
    Serial.println(str4);
}

*/

main();
