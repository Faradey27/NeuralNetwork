class Connection {
    constructor() {
        this.weight = 0;
        this.deltaWeight = 0;
        this.createWeight();
    }

    createWeight() {
        this.weight = Math.random();
    }

    getWeight() {
        return this.weight;
    }

    addToWeight(value) {
        this.weight += value;
    }
}

export default Connection;