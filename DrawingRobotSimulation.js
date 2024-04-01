

const canvasHeight = 540;
const canvasWidth = 720;
const pulseSize = 0.1;

//let targetIndex = 0;
const targetPoint = [{ x: 150, y: 300 }, { x: 300, y: 300 }, { x: 325, y: 400 }] //{ x: Math.floor(canvasWidth / 2), y: Math.floor(canvasHeight / 2) };


function main() {
    const canvas = document.getElementById("base");
    const overlayCanvas = document.getElementById("overlay");

    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    overlayCanvas.height = canvasHeight;
    overlayCanvas.width = canvasWidth;


    if (canvas.getContext) draw(canvas, overlayCanvas);

}

function draw(canvas, overlay) {
    let limbPosition = { x: 0, y: 0 };
    let penDown = true;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();

    const otx = overlay.getContext("2d");

    otx.fillStyle = "rgb(50 200 0 / 20%)";
    otx.fillRect(...verticalLimb(limbPosition.x));
    otx.fillRect(...horizontalLimb(limbPosition.y));

    otx.fillStyle = "rgb(0 0 0 / 20%)";
    otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

    let nInterval = setInterval(() => {
        otx.clearRect(0, 0, canvasWidth, canvasHeight)

        moveLimbs(limbPosition);

        otx.fillStyle = "rgb(50 200 0 / 20%)";
        otx.fillRect(...verticalLimb(limbPosition.x));
        otx.fillRect(...horizontalLimb(limbPosition.y));

        otx.fillStyle = "rgb(0 0 0 / 20%)";
        otx.fillRect(limbPosition.x, limbPosition.y, 16, 16);

        if (penDown) drawTool(limbPosition, ctx);

        if ((limbPosition.y === targetPoint[0].y && limbPosition.x === targetPoint[0].x) || limbPosition.x >= canvasWidth || limbPosition.y >= canvasHeight) {
            ctx.stroke();
            ctx.closePath();
            clearInterval(nInterval);
            nInterval = null;
        }
    }, 10);

}

function drawTool(position, ctx) {

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



function moveLimbs(limbPosition) {

    const stepXY = step(limbPosition);

    limbPosition.x += stepXY.x;
    limbPosition.y += stepXY.y;

    console.log(limbPosition)
}



function step(limbPosition) {

    const ratioOfStep = linearMagnitude(limbPosition);
    console.log(ratioOfStep)

    return { x: ratioOfStep.returnX, y: ratioOfStep.returnY };
}

let maginuted = null;

function linearMagnitude(limbPosition) {
    const linearX = targetPoint[0].x - limbPosition.x;
    const linearY = targetPoint[0].y - limbPosition.y;

    if (maginuted === null) {
        maginuted = linearY / linearX
    }
    //const magnitude = linearY / linearX;

    console.log(maginuted);

    const workingX = (Math.pow(pulseSize, 2)) / (1 + Math.pow(maginuted, 2))

    const returnX = Math.sqrt(workingX);

    const returnY = Math.sqrt(Math.pow(pulseSize, 2) - workingX);

    return { returnY, returnX };
}

//const stepSize = 1;

//function step(limbPosition) {
//    if (limbPosition.x === targetPoint[targetIndex].x && limbPosition.y === targetPoint[targetIndex].y) {
//        if (targetIndex < targetPoint.length - 1) targetIndex++;
//        else return { x: 0, y: 0 };
//    }
//
//    let m = (targetPoint[targetIndex].y - limbPosition.y) / (targetPoint[targetIndex].x - limbPosition.x);
//    let c = limbPosition.y - limbPosition.x * m;
//
//    let stepX = limbPosition.x + stepSize;
//    let stepY = stepX * m + c;
//
//    console.log({ x: stepX - limbPosition.x, y: stepY - limbPosition.y });
//
//    return { x: (limbPosition.x < targetPoint[targetIndex].x ? 1 : -1) * (stepSize), y: stepY - limbPosition.y };
//}




main();
