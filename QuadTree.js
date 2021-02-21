const NW = 0;
const NE = 1;
const SW = 2;
const SE = 3;

class QuadTree {
    maxCapacity = 10;
    maxLevels = 150;

    constructor(bounds, level) {
        this.bounds = bounds;
        this.elements = [];
        this.quadrants = [];
        this.level = level;
        this.isSplit = false;
    }

    /**
     * Insert an element into the quad tree. If the limit is surpassed split the quadrant
     */
    insert(element) {
        if (this.isSplit) {
            const indexes = this.index(element);

            for (const index of indexes) {
                this.quadrants[index].insert(element);
            }

            return;
        }

        this.elements.push(element);

        if (
            this.elements.length > this.maxCapacity &&
            this.level < this.maxLevels
        ) {
            if (!this.isSplit) {
                this.split();
            }

            for (const existingElement of this.elements) {
                const indexes = this.index(existingElement);

                for (const index of indexes) {
                    this.quadrants[index].insert(existingElement);
                }
            }

            this.elements = [];
        }
    }

    /**
     * Splits the current quadrant into 4
     */
    split() {
        const x = Math.floor(this.bounds.x);
        const y = Math.floor(this.bounds.y);
        const w = Math.floor(this.bounds.width / 2);
        const h = Math.floor(this.bounds.height / 2);

        this.isSplit = true;

        // North West Quadrant
        this.quadrants[NW] = new QuadTree(
            new Rectangle(x, y, w, h),
            this.level + 1
        );

        // North East Quadrant
        this.quadrants[NE] = new QuadTree(
            new Rectangle(x + w, y, w, h),
            this.level + 1
        );

        // South West Quadrant
        this.quadrants[SW] = new QuadTree(
            new Rectangle(x, y + h, w, h),
            this.level + 1
        );

        // South East Quadrant
        this.quadrants[SE] = new QuadTree(
            new Rectangle(x + w, y + h, w, h),
            this.level + 1
        );
    }

    /**
     * Clears all the values from the QuadTree
     */
    clear() {
        this.elements = [];

        for (const quadrant of this.quadrants) {
            if (quadrant.isSplit) {
                quadrant.clear();
            }
        }

        this.quadrants = [];
        this.isSplit = false;
    }

    /**
     * Get the index of the quadrant the element is in
     */
    index(element) {
        const indexes = [];
        const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        const startNorth = element.y < horizontalMidpoint;
        const startWest = element.x < verticalMidpoint;
        const endEast = element.x + element.width > verticalMidpoint;
        const endSouth = element.y + element.height > horizontalMidpoint;

        // check the bounds of each quadrant
        if (startNorth && endEast) indexes.push(NE);
        if (startWest && startNorth) indexes.push(NW);
        if (startWest && endSouth) indexes.push(SW);
        if (endEast && endSouth) indexes.push(SE);

        return indexes;
    }

    /**
     * Retrieve all the elements with which there could be a collision
     */
    retrieve(element) {
        const indexes = this.index(element);
        let retElements = [...this.elements];

        // retrieve elements from child quadrants
        if (this.isSplit) {
            for (const index of indexes) {
                retElements = retElements.concat(
                    this.quadrants[index].retrieve(element)
                );
            }
        }

        // return the elements with all duplicates filtered out
        return retElements.filter((e, i) => retElements.indexOf(e) >= i);
    }

    render() {
        this.bounds.render();

        if (this.isSplit) {
            for (let i = 0; i < this.quadrants.length; i++) {
                this.quadrants[i].render();
            }
        }
    }
}
