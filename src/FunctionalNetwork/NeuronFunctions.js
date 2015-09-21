function transferFunction (x) {
    return Math.tanh(x);
}

function transferFunctionDerivative(x) {
    return 1 - x * x;
}

function feedForwardNeuron(neuron, prevLayer) {
    let sum = 0;
    for (let n = 0; n < prevLayer.length; ++n) {
        sum += prevLayer[n].outputVal *
               prevLayer[n].outputWeights[neuron.index].weight;
    }
    neuron.outputVal = transferFunction(sum);
}

function calcOutputGradients (neuron, targetVal) {
    let delta = targetVal - neuron.outputVal;
    neuron.gradient = delta * transferFunctionDerivative(neuron.outputVal);
}

function sumDOW (neuron, nextLayer) {
    let sum = 0.0;

    for (let n = 0; n < nextLayer.length - 1; ++n) {
        sum += neuron.outputWeights[n].weight * nextLayer[n].gradient;
    }

    return sum;
}

function calcHiddenGradients (neuron, nextLayer) {
    let dow = sumDOW(neuron, nextLayer);
    neuron.gradient = dow * transferFunctionDerivative(neuron.outputVal);
}

function updateInputWeights (neuron, prevLayer) {
    for (let n = 0; n < prevLayer.length; ++n) {
        let neuronFromPrevLayer = prevLayer[n];
        let oldDeltaWeight = neuronFromPrevLayer.outputWeights[neuron.index].deltaWeight;
        let newDeltaWeight =
                neuron.eta
                * neuronFromPrevLayer.outputVal
                * neuron.gradient
                + neuron.alpha
                * oldDeltaWeight;
        neuronFromPrevLayer.outputWeights[neuron.index].deltaWeight = newDeltaWeight;
        neuronFromPrevLayer.outputWeights[neuron.index].weight += newDeltaWeight;
    }
}


let neuronFunctions = {
    updateInputWeights: updateInputWeights,
    calcHiddenGradients: calcHiddenGradients,
    calcOutputGradients: calcOutputGradients,
    feedForwardNeuron: feedForwardNeuron
};

export default neuronFunctions