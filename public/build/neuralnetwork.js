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

	var _NetworkJs = __webpack_require__(1);

	var _NetworkJs2 = _interopRequireDefault(_NetworkJs);

	var _NetworkJs3 = __webpack_require__(6);

	var _NetworkJs4 = _interopRequireDefault(_NetworkJs3);

	var networkParams = {
	    topology: [2, 4, 1],
	    alpha: 0.5,
	    eta: 0.15,
	    recentAverageSmoothingFactor: 100
	};
	var network = new _NetworkJs2['default'](networkParams);

	var net = _NetworkJs4['default'].create(networkParams);
	console.info(net);

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
	    for (var i = 0; i < 50000; i++) {
	        var index = Math.floor(Math.random() * tableLength);
	        table.push(table[index]);
	    }
	    console.info('create lessons', new Date() - t1);
	    t1 = new Date();
	    for (var i = 0; i < table.length; i++) {
	        var data = table[i];
	        network.feedForward(data.input);
	        network.backProp(data.output);
	    }
	    console.info('learn', new Date() - t1);
	    console.info(network.getRecentAverageError(), table.length);
	}

	function learn2() {
	    var tableLength = table.length;
	    var t1 = new Date();
	    for (var i = 0; i < 50000; i++) {
	        var index = Math.floor(Math.random() * tableLength);
	        table.push(table[index]);
	    }
	    console.info('create lessons', new Date() - t1);
	    t1 = new Date();
	    for (var i = 0; i < table.length; i++) {
	        var data = table[i];
	        _NetworkJs4['default'].feedForward(data.input, net);
	        _NetworkJs4['default'].backProp(data.output, net);
	    }
	    console.info('learn', new Date() - t1);
	    console.info(net.recentAverageError, table.length);
	}

	learn();
	learn2();

	window.network = _NetworkJs4['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _NetworkNeuronJs = __webpack_require__(2);

	var _NetworkNeuronJs2 = _interopRequireDefault(_NetworkNeuronJs);

	var _NetworkLayersJs = __webpack_require__(4);

	var _NetworkLayersJs2 = _interopRequireDefault(_NetworkLayersJs);

	var _NetworkLayerJs = __webpack_require__(5);

	var _NetworkLayerJs2 = _interopRequireDefault(_NetworkLayerJs);

	var Net = (function () {
	    function Net(struct) {
	        _classCallCheck(this, Net);

	        this.recentAverageSmoothingFactor = struct.recentAverageSmoothingFactor || 100;
	        this.error = 0;
	        this.recentAverageError = 0;
	        var topology = struct.topology;
	        this.layers = new _NetworkLayersJs2['default']();
	        var numLayers = topology.length;
	        for (var layerNum = 0; layerNum < numLayers; ++layerNum) {
	            var layer = new _NetworkLayerJs2['default']();
	            this.layers.createLayer(layer);
	            var numOutputs = layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
	            var lastLayer = this.layers.getLast();
	            for (var neuronNum = 0; neuronNum <= topology[layerNum]; ++neuronNum) {
	                lastLayer.createNeuron(new _NetworkNeuronJs2['default'](numOutputs, neuronNum, struct.eta, struct.alpha));
	            }
	            lastLayer.getLast().setOutputVal(1);
	        }
	    }

	    _createClass(Net, [{
	        key: 'getResults',
	        value: function getResults() {
	            var resultVals = [];
	            for (var n = 0; n < this.layers.getLast().length() - 1; ++n) {
	                resultVals.push(this.layers.getLast().getNeuronByIndex(n).getOutputVal());
	            }
	            return resultVals;
	        }
	    }, {
	        key: 'backProp',
	        value: function backProp(targetVals) {
	            var outputLayer = this.layers.getLast();
	            this.error = 0;

	            for (var n = 0; n < outputLayer.length() - 1; ++n) {
	                var delta = targetVals[n] - outputLayer.getNeuronByIndex(n).getOutputVal();
	                this.error += delta * delta;
	            }
	            this.error /= outputLayer.length() - 1;
	            this.error = Math.sqrt(this.error);

	            this.recentAverageError = (this.recentAverageError * this.recentAverageSmoothingFactor + this.error) / (this.recentAverageSmoothingFactor + 1.0);

	            for (var n = 0; n < outputLayer.length() - 1; ++n) {
	                outputLayer.getNeuronByIndex(n).calcOutputGradients(targetVals[n]);
	            }

	            for (var layerNum = this.layers.length() - 2; layerNum > 0; --layerNum) {
	                var hiddenLayer = this.layers.getLayerByIndex(layerNum);
	                var nextLayer = this.layers.getLayerByIndex(layerNum + 1);
	                for (var n = 0; n < hiddenLayer.length(); ++n) {
	                    hiddenLayer.getNeuronByIndex(n).calcHiddenGradients(nextLayer);
	                }
	            }

	            for (var layerNum = this.layers.length() - 1; layerNum > 0; --layerNum) {
	                var layer = this.layers.getLayerByIndex(layerNum);
	                var prevLayer = this.layers.getLayerByIndex(layerNum - 1);

	                for (var n = 0; n < layer.length() - 1; ++n) {
	                    layer.getNeuronByIndex(n).updateInputWeights(prevLayer);
	                }
	            }
	        }
	    }, {
	        key: 'feedForward',
	        value: function feedForward(inputVals) {
	            for (var i = 0; i < inputVals.length; ++i) {
	                this.layers.getFirst().getNeuronByIndex(i).setOutputVal(inputVals[i]);
	            }

	            for (var layerNum = 1; layerNum < this.layers.length(); ++layerNum) {
	                var prevLayer = this.layers.getLayerByIndex(layerNum - 1);
	                for (var n = 0; n < this.layers.getLayerByIndex(layerNum).length() - 1; ++n) {
	                    this.layers.getLayerByIndex(layerNum).getNeuronByIndex(n).feedForward(prevLayer);
	                }
	            }
	        }
	    }, {
	        key: 'getRecentAverageError',
	        value: function getRecentAverageError() {
	            return this.recentAverageError;
	        }
	    }]);

	    return Net;
	})();

	exports['default'] = Net;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _ConnectionJs = __webpack_require__(3);

	var _ConnectionJs2 = _interopRequireDefault(_ConnectionJs);

	var Neuron = (function () {
	    function Neuron(numOutputs, index, eta, alpha) {
	        _classCallCheck(this, Neuron);

	        this.eta = eta || 0.15;
	        this.alpha = alpha || 0.5;
	        this.outputWeights = [];
	        this.outputVal = 0;
	        this.gradient = 0;
	        this.index = index;
	        this.createOutputWeights(numOutputs);
	    }

	    _createClass(Neuron, [{
	        key: 'createOutputWeights',
	        value: function createOutputWeights(numOutputs) {
	            for (var c = 0; c < numOutputs; ++c) {
	                this.outputWeights.push(new _ConnectionJs2['default']());
	            }
	        }
	    }, {
	        key: 'setOutputVal',
	        value: function setOutputVal(outputVal) {
	            this.outputVal = outputVal;
	        }
	    }, {
	        key: 'getOutputVal',
	        value: function getOutputVal() {
	            return this.outputVal;
	        }
	    }, {
	        key: 'updateInputWeights',
	        value: function updateInputWeights(prevLayer) {
	            for (var n = 0; n < prevLayer.length(); ++n) {
	                var neuron = prevLayer.getNeuronByIndex(n);
	                var oldDeltaWeight = neuron.outputWeights[this.index].deltaWeight;
	                var newDeltaWeight = this.eta * neuron.getOutputVal() * this.gradient + this.alpha * oldDeltaWeight;
	                neuron.outputWeights[this.index].deltaWeight = newDeltaWeight;
	                neuron.outputWeights[this.index].addToWeight(newDeltaWeight);
	            }
	        }
	    }, {
	        key: 'sumDOW',
	        value: function sumDOW(nextLayer) {
	            var sum = 0.0;

	            for (var n = 0; n < nextLayer.length() - 1; ++n) {
	                sum += this.outputWeights[n].getWeight() * nextLayer.getNeuronByIndex(n).gradient;
	            }

	            return sum;
	        }
	    }, {
	        key: 'calcHiddenGradients',
	        value: function calcHiddenGradients(nextLayer) {
	            var dow = this.sumDOW(nextLayer);
	            this.gradient = dow * this.transferFunctionDerivative(this.outputVal);
	        }
	    }, {
	        key: 'calcOutputGradients',
	        value: function calcOutputGradients(targetVal) {
	            var delta = targetVal - this.outputVal;
	            this.gradient = delta * this.transferFunctionDerivative(this.outputVal);
	        }
	    }, {
	        key: 'transferFunction',
	        value: function transferFunction(x) {
	            return Math.tanh(x);
	        }
	    }, {
	        key: 'transferFunctionDerivative',
	        value: function transferFunctionDerivative(x) {
	            return 1 - x * x;
	        }
	    }, {
	        key: 'feedForward',
	        value: function feedForward(prevLayer) {
	            var sum = 0;

	            for (var n = 0; n < prevLayer.length(); ++n) {
	                sum += prevLayer.getNeuronByIndex(n).getOutputVal() * prevLayer.getNeuronByIndex(n).outputWeights[this.index].getWeight();
	            }

	            this.outputVal = this.transferFunction(sum);
	        }
	    }]);

	    return Neuron;
	})();

	exports['default'] = Neuron;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Connection = (function () {
	    function Connection() {
	        _classCallCheck(this, Connection);

	        this.weight = 0;
	        this.deltaWeight = 0;
	        this.createWeight();
	    }

	    _createClass(Connection, [{
	        key: "createWeight",
	        value: function createWeight() {
	            this.weight = Math.random();
	        }
	    }, {
	        key: "getWeight",
	        value: function getWeight() {
	            return this.weight;
	        }
	    }, {
	        key: "addToWeight",
	        value: function addToWeight(value) {
	            this.weight += value;
	        }
	    }]);

	    return Connection;
	})();

	exports["default"] = Connection;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Layers = (function () {
	    function Layers() {
	        _classCallCheck(this, Layers);

	        this.layers = [];
	    }

	    _createClass(Layers, [{
	        key: "createLayer",
	        value: function createLayer(layer) {
	            this.layers.push(layer);
	        }
	    }, {
	        key: "getLast",
	        value: function getLast() {
	            return this.layers[this.layers.length - 1];
	        }
	    }, {
	        key: "getFirst",
	        value: function getFirst() {
	            return this.layers[0];
	        }
	    }, {
	        key: "length",
	        value: function length() {
	            return this.layers.length;
	        }
	    }, {
	        key: "getLayerByIndex",
	        value: function getLayerByIndex(index) {
	            return this.layers[index];
	        }
	    }]);

	    return Layers;
	})();

	exports["default"] = Layers;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Layer = (function () {
	    function Layer() {
	        _classCallCheck(this, Layer);

	        this.neurons = [];
	    }

	    _createClass(Layer, [{
	        key: "createNeuron",
	        value: function createNeuron(neuron) {
	            this.neurons.push(neuron);
	        }
	    }, {
	        key: "getFirst",
	        value: function getFirst() {
	            return this.neurons[0];
	        }
	    }, {
	        key: "length",
	        value: function length() {
	            return this.neurons.length;
	        }
	    }, {
	        key: "getLast",
	        value: function getLast() {
	            return this.neurons[this.neurons.length - 1];
	        }
	    }, {
	        key: "getNeuronByIndex",
	        value: function getNeuronByIndex(index) {
	            return this.neurons[index];
	        }
	    }]);

	    return Layer;
	})();

	exports["default"] = Layer;
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports) {

	//import network from './Network/network.json';

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	        var lastLayer = getLast(network.layers);
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
	        getLast(lastLayer).outputVal = 1;
	    }
	    return network;
	}

	function getNumOfOutputs(layerNum, topology) {
	    return layerNum == topology.length - 1 ? 0 : topology[layerNum + 1];
	}

	function getLast(arr) {
	    return arr[arr.length - 1];
	}

	function getFirst(arr) {
	    return arr[0];
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
	        getFirst(layers)[i].outputVal = inputVals[i];
	    }

	    for (var layerNum = 1; layerNum < layers.length; ++layerNum) {
	        var prevLayer = layers[layerNum - 1];
	        for (var n = 0; n < layers[layerNum].length - 1; ++n) {
	            feedForwardNeuron(layers[layerNum][n], prevLayer);
	        }
	    }
	}

	function transferFunction(x) {
	    return Math.tanh(x);
	}

	function feedForwardNeuron(neuron, prevLayer) {
	    var sum = 0;
	    for (var n = 0; n < prevLayer.length; ++n) {
	        sum += prevLayer[n].outputVal * prevLayer[n].outputWeights[neuron.index].weight;
	    }

	    neuron.outputVal = transferFunction(sum);
	}

	function transferFunctionDerivative(x) {
	    return 1 - x * x;
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

	function backProp(targetVals, network) {
	    var layers = network.layers;
	    var outputLayer = getLast(layers);
	    network.error = 0;

	    for (var n = 0; n < outputLayer.length - 1; ++n) {
	        var delta = targetVals[n] - outputLayer[n].outputVal;
	        network.error += delta * delta;
	    }

	    network.error /= outputLayer.length - 1;
	    network.error = Math.sqrt(network.error);

	    network.recentAverageError = (network.recentAverageError * network.recentAverageSmoothingFactor + network.error) / (network.recentAverageSmoothingFactor + 1.0);

	    for (var n = 0; n < outputLayer.length - 1; ++n) {
	        calcOutputGradients(outputLayer[n], targetVals[n]);
	    }

	    for (var layerNum = layers.length - 2; layerNum > 0; --layerNum) {
	        var hiddenLayer = layers[layerNum];
	        var nextLayer = layers[layerNum + 1];
	        for (var n = 0; n < hiddenLayer.length; ++n) {
	            calcHiddenGradients(hiddenLayer[n], nextLayer);
	        }
	    }

	    for (var layerNum = layers.length - 1; layerNum > 0; --layerNum) {
	        var layer = layers[layerNum];
	        var prevLayer = layers[layerNum - 1];

	        for (var n = 0; n < layer.length - 1; ++n) {
	            updateInputWeights(layer[n], prevLayer);
	        }
	    }
	}

	var x = {
	    create: createNetwork,
	    feedForward: feedForward,
	    backProp: backProp
	};

	exports["default"] = x;
	module.exports = exports["default"];

/***/ }
/******/ ]);