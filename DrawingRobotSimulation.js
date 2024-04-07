


const canvasHeight = 540;
const canvasWidth = 720;
const stepSize = 1;

const pulseInterval = 500;

let previousTimestamp;

let penDown = true;
//let targetIndex = 0;
const targetPoint = [{ x: 150, y: 300 }, { x: 300, y: 300 }, { x: 325, y: 400 }] //{ x: Math.floor(canvasWidth / 2), y: Math.floor(canvasHeight / 2) };
let limbPosition = { x: 0, y: 0 };

function main() {

    const canvas = document.getElementById("base");
    const overlayCanvas = document.getElementById("overlay");

    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    overlayCanvas.height = canvasHeight;
    overlayCanvas.width = canvasWidth;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        const otx = overlayCanvas.getContext("2d");
        initialDraw(ctx, otx);
        window.requestAnimationFrame((t) => draw(t, ctx, otx));

    }
}

function initialDraw(ctx, otx) {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();

    otx.fillStyle = "rgb(50 200 0 / 20%)";
    otx.fillRect(...verticalLimb(limbPosition.x));
    otx.fillRect(...horizontalLimb(limbPosition.y));

    otx.fillStyle = "rgb(0 0 0 / 20%)";
    otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

}

function draw(timestamp, ctx, otx) {
    if (previousTimestamp === undefined) previousTimestamp = timestamp;

    const elapsed = timestamp - previousTimestamp;


    if (elapsed >= pulseInterval) {
        otx.clearRect(0, 0, canvasWidth, canvasHeight)

        turnStepperMotors(limbPosition);

        drawLimbs(otx, limbPosition);

        if (penDown) drawTo(limbPosition, ctx);
    }


    if ((limbPosition.y === targetPoint[0].y && limbPosition.x === targetPoint[0].x) || limbPosition.x >= canvasWidth || limbPosition.y >= canvasHeight) {
        ctx.stroke();
        ctx.closePath();

    } else {
        window.requestAnimationFrame((t) => (draw(t, ctx, otx)));

    }
}

function drawLimbs(otx, limbPosition) {
    otx.fillStyle = "rgb(50 200 0 / 20%)";
    otx.fillRect(...verticalLimb(limbPosition.x));
    otx.fillRect(...horizontalLimb(limbPosition.y));

    otx.fillStyle = "rgb(0 0 0 / 20%)";
    otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

}

function drawTo(position, ctx) {

    ctx.lineTo(position.x + 8, position.y + 8);
    ctx.stroke();

}

function horizontalLimb(position) {
    const y = position;
    const x = 0;

    const width = canvasWidth;
    const height = 16;

    return [x, y, width, height];

}

function verticalLimb(position) {
    const y = 0;
    const x = position;

    const width = 16;
    const height = canvasHeight;

    return [x, y, width, height];

}


function turnStepperMotors(limbPosition) {

    const pulse = pulseGenerator(limbPosition);

    limbPosition.x += pulse.x ? getDirectionOfTurn(pulse.xDirection) : 0;
    limbPosition.y += pulse.y ? getDirectionOfTurn(pulse.yDirection) : 0;

}

function getDirectionOfTurn(direction) {
    return direction ? stepSize : -stepSize;
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
