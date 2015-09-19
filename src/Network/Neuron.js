import Connection from './Connection.js';

class Neuron {
    constructor(numOutputs, index, eta, alpha) {
        this.eta = eta || 0.15;
        this.alpha = alpha || 0.5;
        this.outputWeights = [];
        this.outputVal = 0;
        this.gradient = 0;
        this.index = index;
        this.createOutputWeights(numOutputs);
    }

    createOutputWeights(numOutputs) {
        for (let c = 0; c < numOutputs; ++c) {
            this.outputWeights.push(new Connection());
        }
    }

    setOutputVal(outputVal) {
        this.outputVal = outputVal;
    }

    getOutputVal() {
        return this.outputVal;
    }

    updateInputWeights(prevLayer) {
        for (let n = 0; n < prevLayer.length(); ++n) {
            let neuron = prevLayer.getNeuronByIndex(n);
            let oldDeltaWeight = neuron.outputWeights[this.index].deltaWeight;
            let newDeltaWeight =
                    this.eta
                    * neuron.getOutputVal()
                    * this.gradient
                    + this.alpha
                    * oldDeltaWeight;
            neuron.outputWeights[this.index].deltaWeight = newDeltaWeight;
            neuron.outputWeights[this.index].addToWeight(newDeltaWeight);
        }
    }

    sumDOW(nextLayer) {
        let sum = 0.0;

        for (let n = 0; n < nextLayer.length() - 1; ++n) {
            sum += this.outputWeights[n].getWeight() * nextLayer.getNeuronByIndex(n).gradient;
        }

        return sum;
    }

    calcHiddenGradients(nextLayer) {
        let dow = this.sumDOW(nextLayer);
        this.gradient = dow * this.transferFunctionDerivative(this.outputVal);
    }

    calcOutputGradients(targetVal) {
        let delta = targetVal - this.outputVal;
        this.gradient = delta * this.transferFunctionDerivative(this.outputVal);
    }

    transferFunction(x) {
        return Math.tanh(x);
    }

    transferFunctionDerivative(x) {
        return 1 - x * x;
    }

    feedForward(prevLayer) {
        let sum = 0;

        for (let n = 0; n < prevLayer.length(); ++n) {
            sum += prevLayer.getNeuronByIndex(n).getOutputVal() *
                   prevLayer.getNeuronByIndex(n).outputWeights[this.index].getWeight();
        }

        this.outputVal = this.transferFunction(sum);
    }
}

export default Neuron;