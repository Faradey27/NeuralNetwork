//import network from './Network/network.json';

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
                outputWeights: getOutputWeights()
            }
            lastLayer.push(neuron);
        }
        getLast(lastLayer).outputVal = 1;
    }
    console.info(network);
    return network;
}

function getNumOfOutputs (layerNum, topology) {
    return layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
}

function getLast(arr) {
    return arr[arr.length - 1];
}

function getFirst(arr) {
    return arr[0];
}

function getOutputWeights(num) {
    let res;
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

    /*for (let layerNum = 1; layerNum < this.layers.length(); ++layerNum) {
        let prevLayer = this.layers.getLayerByIndex(layerNum - 1);
        for (let n = 0; n < this.layers.getLayerByIndex(layerNum).length() - 1; ++n) {
            this.layers.getLayerByIndex(layerNum).getNeuronByIndex(n).feedForward(prevLayer);
        }
    }*/
}

var x = {
    create: createNetwork,
    feedForward: feedForward
}

export default createNetwork;