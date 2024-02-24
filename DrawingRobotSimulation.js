

const canvasHeight = 540;
const canvasWidth = 720;

const targetPoint = { x: Math.floor(canvasWidth / 2), y: Math.floor(canvasHeight / 2) };


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
    let limbPosition = { x: 10, y: 10 };
    let penDown = false;

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

        if (limbPosition.y === targetPoint.y && limbPosition.x === targetPoint.x) {
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
}

const stepSize = 1;

function step(limbPosition) {
    if (limbPosition.x === targetPoint.x && limbPosition.y === targetPoint.y) return { x: 0, y: 0 }

    let m = (targetPoint.y - limbPosition.y) / (targetPoint.x - limbPosition.x);
    let c = limbPosition.y - limbPosition.x * m;

    let stepX = limbPosition.x + stepSize;
    let stepY = stepX * m + c;

    console.log({ x: stepX - limbPosition.x, y: stepY - limbPosition.y });

    return { x: stepX - limbPosition.x, y: stepY - limbPosition.y };
}




main();
