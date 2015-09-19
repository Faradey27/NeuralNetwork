
class Connection {
    constructor() {
        this.weight = 0;
        this.deltaWeight = 0;
    }
}

var Layer = [];

class Neuron {
    constructor(numOutputs, myIndex) {
        this.eta = 0.15;
        this.alpha = 0.5;
        this.m_outputWeights = [];
        this.m_outputVal = 0;
        this.m_gradient = 0;
        for (let c = 0; c < numOutputs; ++c) {
            this.m_outputWeights.push(new Connection());
            this.m_outputWeights[this.m_outputWeights.length - 1].weight = this.randomWeight();
        }

        this.m_myIndex = myIndex;
    }

    setOutputVal(m_outputVal) {
        this.m_outputVal = m_outputVal;
    }

    getOutputVal() {
        return this.m_outputVal;
    }

    randomWeight() {
        return Math.random();
    }

    updateInputWeights(prevLayer) {
        for (let n = 0; n < prevLayer.length; ++n) {
            let neuron = prevLayer[n];
            let oldDeltaWeight = neuron.m_outputWeights[this.m_myIndex].deltaWeight;
            let newDeltaWeight =
                    this.eta
                    * neuron.getOutputVal()
                    * this.m_gradient
                    + this.alpha
                    * oldDeltaWeight;
            neuron.m_outputWeights[this.m_myIndex].deltaWeight = newDeltaWeight;
            neuron.m_outputWeights[this.m_myIndex].weight += newDeltaWeight;
        }
    }

    sumDOW(nextLayer) {
        let sum = 0.0;

        for (let n = 0; n < nextLayer.legth - 1; ++n) {
            sum += this.m_outputWeights[n].weight * nextLayer[n].m_gradient;
        }

        return sum;
    }

    calcHiddenGradients(nextLayer) {
        let dow = this.sumDOW(nextLayer);
        this.m_gradient = dow * this.transferFunctionDerivative(this.m_outputVal);
    }

    calcOutputGradients(targetVal) {
        let delta = targetVal - this.m_outputVal;
        this.m_gradient = delta * this.transferFunctionDerivative(this.m_outputVal);
    }

    transferFunction(x) {
        return Math.tanh(x);
    }

    transferFunctionDerivative(x) {
        return 1 - x * x;
    }

    feedForward(prevLayer) {
        let sum = 0;

        for (let n = 0; n < prevLayer.length; ++n) {
            sum += prevLayer[n].getOutputVal() *
                   prevLayer[n].m_outputWeights[this.m_myIndex].weight;
        }

        this.m_outputVal = this.transferFunction(sum);
    }
}

class Net {
    constructor(topology) {
        this.m_recentAverageSmoothingFactor = 100;
        this.m_error = 0;
        this.m_recentAverageError = 0;
        this.m_layers = [];
        let numLayers = topology.length;
        for (let layerNum = 0; layerNum < numLayers; ++layerNum) {
            this.m_layers.push([]);
            let numOutputs = layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];

            for (let neuronNum = 0; neuronNum <= topology[layerNum]; ++neuronNum) {
                this.m_layers[this.m_layers.length - 1].push(new Neuron(numOutputs, neuronNum));
                console.info('made neuron')
            }
            this.m_layers[this.m_layers.length - 1][this.m_layers[this.m_layers.length - 1].length - 1].setOutputVal(1);
        }
    }

    getResults() {
        let resultVals = [];
        for (let n = 0; n < this.m_layers[this.m_layers.length - 1].length - 1; ++n) {
            resultVals.push(this.m_layers[this.m_layers.length - 1][n].getOutputVal());
        }
        return resultVals;
    }

    backProp(targetVals) {
        let outputLayer = this.m_layers[this.m_layers.length - 1];
        this.m_error = 0;

        for (let n = 0; n < outputLayer.length - 1; ++n) {
            let delta = targetVals[n] - outputLayer[n].getOutputVal();
            this.m_error += delta * delta;
        }
        this.m_error /= outputLayer.length - 1;
        this.m_error = Math.sqrt(this.m_error);

        this.m_recentAverageError =
                (this.m_recentAverageError * this.m_recentAverageSmoothingFactor + this.m_error)
                / (this.m_recentAverageSmoothingFactor + 1.0);

        for (let n = 0; n < outputLayer.length - 1; ++n) {
            outputLayer[n].calcOutputGradients(targetVals[n]);
        }

        for (let layerNum = this.m_layers.length - 2; layerNum > 0; --layerNum) {
            let hiddenLayer = this.m_layers[layerNum];
            let nextLayer = this.m_layers[layerNum + 1];

            for (let n = 0; n < hiddenLayer.length; ++n) {
                hiddenLayer[n].calcHiddenGradients(nextLayer);
            }
        }

        for (let layerNum = this.m_layers.length - 1; layerNum > 0; --layerNum) {
            let layer = this.m_layers[layerNum];
            let prevLayer = this.m_layers[layerNum - 1];

            for (let n = 0; n < layer.length - 1; ++n) {
                layer[n].updateInputWeights(prevLayer);
            }
        }
    }

    feedForward(inputVals) {
        for (let i = 0; i < inputVals.length; ++i) {
            this.m_layers[0][i].setOutputVal(inputVals[i]);
        }

        for (let layerNum = 1; layerNum < this.m_layers.length; ++layerNum) {
            let prevLayer = this.m_layers[layerNum - 1];
            for (let n = 0; n < this.m_layers[layerNum].length - 1; ++n) {
                this.m_layers[layerNum][n].feedForward(prevLayer);
            }
        }
    }

    getRecentAverageError() {
        return this.m_recentAverageError;
    }

}

export default Net;
