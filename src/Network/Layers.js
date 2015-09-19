class Layers {
    constructor() {
        this.layers = [];
    }

    createLayer(layer) {
        this.layers.push(layer);
    }

    getLast() {
        return this.layers[this.layers.length - 1];
    }

    getFirst() {
        return this.layers[0];
    }

    length() {
        return this.layers.length;
    }

    getLayerByIndex(index) {
        return this.layers[index];
    }
}

export default Layers;