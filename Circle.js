class Circle {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.velocity = { x: random(-2, 3), y: random(-2, 3) };
        this.radius = random(5, 11);
        this.diameter = this.radius * 2;
        this.height = this.diameter;
        this.width = this.diameter;
        this.highlight = false;
    }

    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x > width - this.radius || this.x < 0 + this.radius) {
            this.velocity.x *= -1;
        }

        if (this.y > height - this.radius || this.y < 0 + this.radius) {
            this.velocity.y *= -1;
        }
    }

    intersects(other) {
        const distance = dist(this.x, this.y, other.x, other.y);
        return distance < this.radius + other.radius;
    }

    setHighlight(value) {
        this.highlight = value;
    }

    render() {
        const fillColor = this.highlight ? 0 : 195;
        noStroke();
        fill(fillColor);
        circle(this.x, this.y, this.diameter);
    }
}
