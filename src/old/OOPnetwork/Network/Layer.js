class Layer {
    constructor() {
        this.neurons = [];
    }

    createNeuron(neuron) {
        this.neurons.push(neuron);
    }

    getFirst() {
        return this.neurons[0];
    }

    length() {
        return this.neurons.length;
    }

    getLast() {
        return this.neurons[this.neurons.length - 1];
    }

    getNeuronByIndex(index) {
        return this.neurons[index];
    }
}

export default Layer;
