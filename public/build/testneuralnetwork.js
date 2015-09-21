/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./public";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _FunctionalNetworkNetworkJs = __webpack_require__(1);

	var _FunctionalNetworkNetworkJs2 = _interopRequireDefault(_FunctionalNetworkNetworkJs);

	var networkParams = {
	    topology: [2, 4, 1],
	    alpha: 0.5,
	    eta: 0.15,
	    recentAverageSmoothingFactor: 100
	};

	var network = _FunctionalNetworkNetworkJs2['default'].createNetwork(networkParams);

	var table = [{
	    input: [0, 0],
	    output: [0]
	}, {
	    input: [1, 1],
	    output: [0]
	}, {
	    input: [1, 0],
	    output: [1]
	}, {
	    input: [0, 1],
	    output: [1]
	}];

	function learn() {
	    var tableLength = table.length;
	    var t1 = new Date();
	    for (var i = 0; i < 500000; i++) {
	        var index = Math.floor(Math.random() * tableLength);
	        table.push(table[index]);
	    }
	    console.info('create lessons', new Date() - t1);
	    t1 = new Date();
	    for (var i = 0; i < table.length; i++) {
	        var data = table[i];
	        _FunctionalNetworkNetworkJs2['default'].feedForward(data.input, network);
	        _FunctionalNetworkNetworkJs2['default'].backProp(data.output, network);
	    }
	    console.info('learn', new Date() - t1);
	    console.info(network.recentAverageError);
	}

	learn();
	console.info(network);

	window.network = _FunctionalNetworkNetworkJs2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _utilsJs = __webpack_require__(2);

	var _NeuronFunctionsJs = __webpack_require__(3);

	var network = {
	    "eta": 0.15,
	    "alpha": 0.5,
	    "error": 0,
	    "recentAverageError": 0,
	    "recentAverageSmoothingFactor": 0,
	    "layers": []
	};

	function createNetwork(struct) {
	    network.error = struct.error || 0;
	    network.recentAverageError = struct.recentAverageError || 0;
	    network.recentAverageSmoothingFactor = struct.recentAverageSmoothingFactor || 0;

	    var topology = struct.topology;
	    var numLayers = topology.length;
	    for (var layerNum = 0; layerNum < numLayers; ++layerNum) {
	        var layer = [];
	        network.layers.push(layer);
	        var numOutputs = getNumOfOutputs(layerNum, topology);
	        var lastLayer = (0, _utilsJs.getLast)(network.layers);
	        for (var neuronNum = 0; neuronNum <= topology[layerNum]; ++neuronNum) {
	            var neuron = {
	                eta: struct.eta || 0.15,
	                alpha: struct.alpha || 0.5,
	                outputVal: 0,
	                gradient: 0,
	                index: neuronNum,
	                outputWeights: getOutputWeights(numOutputs)
	            };
	            lastLayer.push(neuron);
	        }
	        (0, _utilsJs.getLast)(lastLayer).outputVal = 1;
	    }
	    return network;
	}

	function getNumOfOutputs(layerNum, topology) {
	    return layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
	}

	function getOutputWeights(num) {
	    var res = [];
	    for (var i = 0; i < num; i++) {
	        res.push({
	            weight: Math.random(),
	            deltaWeight: 0
	        });
	    }
	    return res;
	}

	function feedForward(inputVals, network) {
	    var layers = network.layers;

	    for (var i = 0; i < inputVals.length; ++i) {
	        (0, _utilsJs.getFirst)(layers)[i].outputVal = inputVals[i];
	    }

	    for (var layerNum = 1; layerNum < layers.length; ++layerNum) {
	        var prevLayer = layers[layerNum - 1];
	        for (var n = 0; n < layers[layerNum].length - 1; ++n) {
	            (0, _NeuronFunctionsJs.feedForwardNeuron)(layers[layerNum][n], prevLayer);
	        }
	    }
	}

	function backProp(targetVals, network) {
	    var layers = network.layers;
	    var outputLayer = (0, _utilsJs.getLast)(layers);
	    network.error = 0;

	    for (var n = 0; n < outputLayer.length - 1; ++n) {
	        var delta = targetVals[n] - outputLayer[n].outputVal;
	        network.error += delta * delta;
	    }

	    network.error /= outputLayer.length - 1;
	    network.error = Math.sqrt(network.error);

	    network.recentAverageError = (network.recentAverageError * network.recentAverageSmoothingFactor + network.error) / (network.recentAverageSmoothingFactor + 1.0);

	    for (var n = 0; n < outputLayer.length - 1; ++n) {
	        (0, _NeuronFunctionsJs.calcOutputGradients)(outputLayer[n], targetVals[n]);
	    }

	    for (var layerNum = layers.length - 2; layerNum > 0; --layerNum) {
	        var hiddenLayer = layers[layerNum];
	        var nextLayer = layers[layerNum + 1];
	        for (var n = 0; n < hiddenLayer.length; ++n) {
	            (0, _NeuronFunctionsJs.calcHiddenGradients)(hiddenLayer[n], nextLayer);
	        }
	    }

	    for (var layerNum = layers.length - 1; layerNum > 0; --layerNum) {
	        var layer = layers[layerNum];
	        var prevLayer = layers[layerNum - 1];

	        for (var n = 0; n < layer.length - 1; ++n) {
	            (0, _NeuronFunctionsJs.updateInputWeights)(layer[n], prevLayer);
	        }
	    }
	}

	var networkFunctions = {
	    createNetwork: createNetwork,
	    feedForward: feedForward,
	    backProp: backProp
	};

	exports['default'] = networkFunctions;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function getLast(arr) {
	    return arr[arr.length - 1];
	}

	function getFirst(arr) {
	    return arr[0];
	}

	var utils = {
	    getLast: getLast,
	    getFirst: getFirst
	};

	exports["default"] = utils;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function transferFunction(x) {
	    return Math.tanh(x);
	}

	function transferFunctionDerivative(x) {
	    return 1 - x * x;
	}

	function feedForwardNeuron(neuron, prevLayer) {
	    var sum = 0;
	    for (var n = 0; n < prevLayer.length; ++n) {
	        sum += prevLayer[n].outputVal * prevLayer[n].outputWeights[neuron.index].weight;
	    }
	    neuron.outputVal = transferFunction(sum);
	}

	function calcOutputGradients(neuron, targetVal) {
	    var delta = targetVal - neuron.outputVal;
	    neuron.gradient = delta * transferFunctionDerivative(neuron.outputVal);
	}

	function sumDOW(neuron, nextLayer) {
	    var sum = 0.0;

	    for (var n = 0; n < nextLayer.length - 1; ++n) {
	        sum += neuron.outputWeights[n].weight * nextLayer[n].gradient;
	    }

	    return sum;
	}

	function calcHiddenGradients(neuron, nextLayer) {
	    var dow = sumDOW(neuron, nextLayer);
	    neuron.gradient = dow * transferFunctionDerivative(neuron.outputVal);
	}

	function updateInputWeights(neuron, prevLayer) {
	    for (var n = 0; n < prevLayer.length; ++n) {
	        var neuronFromPrevLayer = prevLayer[n];
	        var oldDeltaWeight = neuronFromPrevLayer.outputWeights[neuron.index].deltaWeight;
	        var newDeltaWeight = neuron.eta * neuronFromPrevLayer.outputVal * neuron.gradient + neuron.alpha * oldDeltaWeight;
	        neuronFromPrevLayer.outputWeights[neuron.index].deltaWeight = newDeltaWeight;
	        neuronFromPrevLayer.outputWeights[neuron.index].weight += newDeltaWeight;
	    }
	}

	var neuronFunctions = {
	    updateInputWeights: updateInputWeights,
	    calcHiddenGradients: calcHiddenGradients,
	    calcOutputGradients: calcOutputGradients,
	    feedForwardNeuron: feedForwardNeuron
	};

	exports["default"] = neuronFunctions;
	module.exports = exports["default"];

/***/ }
/******/ ]);