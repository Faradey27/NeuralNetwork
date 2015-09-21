import {getLast} from './utils.js';
import {getFirst} from './utils.js';
import {feedForwardNeuron} from './NeuronFunctions.js';
import {calcOutputGradients} from './NeuronFunctions.js';
import {calcHiddenGradients} from './NeuronFunctions.js';
import {updateInputWeights} from './NeuronFunctions.js';

var network = {
    "eta": 0.15,
    "alpha": 0.5,
    "error": 0,
    "recentAverageError": 0,
    "recentAverageSmoothingFactor":0,
    "layers": []
};

function createNetwork(struct) {
    network.error = struct.error || 0;
    network.recentAverageError = struct.recentAverageError || 0;
    network.recentAverageSmoothingFactor = struct.recentAverageSmoothingFactor || 0;

    let topology = struct.topology;
    let numLayers = topology.length;
    for (let layerNum = 0; layerNum < numLayers; ++layerNum) {
        let layer = [];
        network.layers.push(layer);
        let numOutputs = getNumOfOutputs(layerNum, topology);
        let lastLayer = getLast(network.layers);
        for (let neuronNum = 0; neuronNum <= topology[layerNum]; ++neuronNum) {
            let neuron = {
                eta: struct.eta || 0.15,
                alpha: struct.alpha || 0.5,
                outputVal: 0,
                gradient: 0,
                index: neuronNum,
                outputWeights: getOutputWeights(numOutputs)
            }
            lastLayer.push(neuron);
        }
        getLast(lastLayer).outputVal = 1;
    }
    return network;
}

function getNumOfOutputs (layerNum, topology) {
    return layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
}

function getOutputWeights(num) {
    let res = [];
    for (let i = 0; i < num; i++) {
        res.push({
            weight: Math.random(),
            deltaWeight: 0
        });
    }
    return res;
}

function feedForward(inputVals, network) {
    let layers = network.layers;

    for (let i = 0; i < inputVals.length; ++i) {
        getFirst(layers)[i].outputVal = inputVals[i];
    }

    for (let layerNum = 1; layerNum < layers.length; ++layerNum) {
        let prevLayer = layers[layerNum - 1];
        for (let n = 0; n < layers[layerNum].length - 1; ++n) {
           feedForwardNeuron(layers[layerNum][n], prevLayer);
        }
    }
}

function backProp(targetVals, network) {
    let layers = network.layers;
    let outputLayer = getLast(layers);
    network.error = 0;

    for (let n = 0; n < outputLayer.length - 1; ++n) {
        let delta = targetVals[n] - outputLayer[n].outputVal;
        network.error += delta * delta;
    }

    network.error /= outputLayer.length - 1;
    network.error = Math.sqrt(network.error);

    network.recentAverageError =
        (network.recentAverageError * network.recentAverageSmoothingFactor + network.error)
        / (network.recentAverageSmoothingFactor + 1.0);

    for (let n = 0; n < outputLayer.length - 1; ++n) {
        calcOutputGradients(outputLayer[n], targetVals[n]);
    }

    for (let layerNum = layers.length - 2; layerNum > 0; --layerNum) {
        let hiddenLayer = layers[layerNum];
        let nextLayer = layers[layerNum + 1];
        for (let n = 0; n < hiddenLayer.length; ++n) {
           calcHiddenGradients(hiddenLayer[n], nextLayer);
        }
    }

    for (let layerNum = layers.length - 1; layerNum > 0; --layerNum) {
        let layer = layers[layerNum];
        let prevLayer = layers[layerNum - 1];

        for (let n = 0; n < layer.length - 1; ++n) {
            updateInputWeights(layer[n], prevLayer);
        }
    }
}

var networkFunctions = {
    createNetwork: createNetwork,
    feedForward: feedForward,
    backProp: backProp
}

export default networkFunctions