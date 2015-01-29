export class Level0 {
    static inject() { return [Level1_1, Level1_2]; }

    /**
     *
     * @param {Level1_1} one
     * @param {Level1_2} two
     */
    constructor(one, two) {
        Object.assign(this, {one, two});
        this.three = two.level2;
    }

    get dependencies() {
        return [this.one, this.two, this.three];
    }
}

export class Level1_1 {
    // No dependencies
    constructor() {}
}

export class Level1_2 {
    static inject() { return [Level2]; }
    constructor(level2) {
        this.level = level2;
    }

    get level2() {
        return this.level;
    }
}

export class Level2 {
    constructor() {}
}