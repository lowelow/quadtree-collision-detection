let circles = [];
let quadTree;

let circleCount = 500;

function setup() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    createCanvas(canvasWidth, canvasHeight);

    const bounds = new Rectangle(0, 0, canvasWidth, canvasHeight);
    quadTree = new QuadTree(bounds, 10);

    createCircles();
}

function draw() {
    background(255);

    renderCircles();
    quadTree.render();
    updateCircles();
    checkCollision();
    fillQuadTree();

    renderCircleCount();
}

function renderCircleCount() {
    textSize(18);
    text(`Circles: ${circleCount}`, 8, height - 25);
}

function randomizeCircleCount() {
    circleCount = Math.floor(random(50, 600));
    createCircles();
}

function createCircles() {
    circles = [];
    for (let i = 0; i < circleCount; i++) {
        circles[i] = new Circle(
            i,
            random(20, width - 20),
            random(20, height - 20)
        );
    }
}

function updateCircles() {
    for (let circle of circles) {
        circle.move();
    }
}

function renderCircles() {
    for (let circle of circles) {
        circle.render();
        circle.setHighlight(false);
    }
}

function fillQuadTree() {
    quadTree.clear();
    for (const circle of circles) {
        quadTree.insert(circle);
    }
}

function checkCollision() {
    for (let outer of circles) {
        const retCircles = quadTree.retrieve(outer);

        for (let inner of retCircles) {
            if (outer !== inner && outer.intersects(inner)) {
                outer.setHighlight(true);
            }
        }
    }
}
