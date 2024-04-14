

function draw(timestamp) {
    if (animation.previousTimestamp === undefined) animation.previousTimestamp = timestamp;

    const elapsed = timestamp - animation.previousTimestamp;


    if (elapsed >= animation.pulseInterval) {
        display.otx.clearRect(0, 0, display.canvasWidth, display.canvasHeight);
        turnStepperMotors(1, 1);
        drawLimbs();
        if (animation.penDown) drawTo();
    }


    if ((limbPosition.y === animation.targetPoints[0].y && limbPosition.x === animation.targetPoints[0].x) || limbPosition.x >= display.canvasWidth || limbPosition.y >= display.canvasHeight) {
        display.ctx.stroke();
        display.ctx.closePath();
    } else {
        window.requestAnimationFrame((t) => (draw(t)));

    }
}

function getDirectionOfTurn(direction) {
    return direction ? animation.stepSize : -animation.stepSize;
}

function pulseGenerator() {
    return { x: true, xDirection: true, y: true, yDirection: true };
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

/*
function moveTo() {
    let x_steps = targetX / (xCalibration / 10000);
    let y_steps = targetY / (yCalibration / 10000);
 
    x = Math.round(x_steps);
    y = Math.round(y_steps);
 
    runSteppersBresenham(x_steps, y_steps);
 
}
*/



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