class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {
        stroke(0);
        noFill();
        rect(this.x, this.y, this.width, this.height);
    }
}
