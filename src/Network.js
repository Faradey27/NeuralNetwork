import Neuron from './Network/Neuron.js';
import Layers from './Network/Layers.js';
import Layer from './Network/Layer.js';

class Net {
    constructor(struct) {
        this.recentAverageSmoothingFactor = struct.recentAverageSmoothingFactor || 100;
        this.error = 0;
        this.recentAverageError = 0;
        let topology = struct.topology
        this.layers = new Layers();
        let numLayers = topology.length;
        for (let layerNum = 0; layerNum < numLayers; ++layerNum) {
            let layer = new Layer();
            this.layers.createLayer(layer);
            let numOutputs = layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
            let lastLayer = this.layers.getLast();
            for (let neuronNum = 0; neuronNum <= topology[layerNum]; ++neuronNum) {
                lastLayer.createNeuron(new Neuron(numOutputs, neuronNum, struct.eta, struct.alpha));
                console.info('made neuron')
            }
            lastLayer.getLast().setOutputVal(1);
        }
        console.info(this.layers)
    }

    getResults() {
        let resultVals = [];
        for (let n = 0; n < this.layers.getLast().length() - 1; ++n) {
            resultVals.push(this.layers.getLast().getNeuronByIndex(n).getOutputVal());
        }
        return resultVals;
    }

    backProp(targetVals) {
        let outputLayer = this.layers.getLast();
        this.error = 0;

        for (let n = 0; n < outputLayer.length() - 1; ++n) {
            let delta = targetVals[n] - outputLayer.getNeuronByIndex(n).getOutputVal();
            this.error += delta * delta;
        }
        this.error /= outputLayer.length() - 1;
        this.error = Math.sqrt(this.error);

        this.recentAverageError =
                (this.recentAverageError * this.recentAverageSmoothingFactor + this.error)
                / (this.recentAverageSmoothingFactor + 1.0);

        for (let n = 0; n < outputLayer.length() - 1; ++n) {
            outputLayer.getNeuronByIndex(n).calcOutputGradients(targetVals[n]);
        }

        for (let layerNum = this.layers.length() - 2; layerNum > 0; --layerNum) {
            let hiddenLayer = this.layers.getLayerByIndex(layerNum);
            let nextLayer = this.layers.getLayerByIndex(layerNum + 1);
            for (let n = 0; n < hiddenLayer.length(); ++n) {
                hiddenLayer.getNeuronByIndex(n).calcHiddenGradients(nextLayer);
            }
        }

        for (let layerNum = this.layers.length() - 1; layerNum > 0; --layerNum) {
            let layer = this.layers.getLayerByIndex(layerNum);
            let prevLayer = this.layers.getLayerByIndex(layerNum - 1);

            for (let n = 0; n < layer.length() - 1; ++n) {
                layer.getNeuronByIndex(n).updateInputWeights(prevLayer);
            }
        }
    }

    feedForward(inputVals) {
        for (let i = 0; i < inputVals.length; ++i) {
            this.layers.getFirst().getNeuronByIndex(i).setOutputVal(inputVals[i]);
        }

        for (let layerNum = 1; layerNum < this.layers.length(); ++layerNum) {
            let prevLayer = this.layers.getLayerByIndex(layerNum - 1);
            for (let n = 0; n < this.layers.getLayerByIndex(layerNum).length() - 1; ++n) {
                this.layers.getLayerByIndex(layerNum).getNeuronByIndex(n).feedForward(prevLayer);
            }
        }
    }

    getRecentAverageError() {
        return this.recentAverageError;
    }

}

export default Net;
