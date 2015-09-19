let Neuron = require('./../../src/Neuron.js');
let Layer = require('./../../src/Layer.js');

describe('Neuron constructor tests', () => {
    let nextLayerNeuronLength = 4;
    let index = 2;
	let neuron = new Neuron(nextLayerNeuronLength, index);
    neuron.eta = 0.15;
    neuron.alpha = 0.5;

	it('eta should be', () => {
	  expect(neuron.eta).toBe(0.15);
	});
    it('alpha should be', () => {
      expect(neuron.alpha).toBe(0.5);
    });
    it('index should be', () => {
      expect(neuron.index).toBe(index);
    });
    it('index should be', () => {
      expect(neuron.gradient).toBe(0);
    });
    it('output value should be', () => {
      expect(neuron.getOutputValue()).toBe(0);
    });
    it('should create connections', () => {
      expect(neuron.outputWeights.length).toBe(nextLayerNeuronLength);
    });
    it('should inizialize delta with zero', () => {
      let deltas = neuron.outputWeights.map((data) => {
        return data.getDelta();
      });
      let res = [];
      for (let i = 0; i < nextLayerNeuronLength; i++) {
        res.push(0);
      }
      expect(deltas).toEqual(res);
    });
    it('should inizialize weight between 0..1', () => {
      let weightsStates = neuron.outputWeights.map((data) => {
        return data.getWeight() >= 0 && data.getWeight() <=1;
      });
      let res = [];
      for (let i = 0; i < nextLayerNeuronLength; i++) {
        res.push(true);
      }
      expect(weightsStates).toEqual(res);
    });
});

describe('Neuron functional tests', () => {
    let nextLayerNeuronLength = 4;
    let index = 2;
    let neuron = new Neuron(nextLayerNeuronLength, index);
    neuron.eta = 0.15;
    neuron.alpha = 0.5;
    neuron.gradient = 4;

    it('gradient should be', () => {
      expect(neuron.getGradient()).toBe(4);
    });
    it('should calc output gradient', () => {
      neuron.approximateFunction = () => {
        return 2;
      };
      neuron.calcOutputGradients(3);
      expect(neuron.getGradient()).toBe(1);
    });
    it('should calc sum dow', () => {
      let layer = new Layer();
      layer.createNeuron(3,0);
      layer.getNeuronByIndex(0).gradient = 0.3;
      layer.createNeuron(3,1);
      layer.getNeuronByIndex(1).gradient = 0.2;
      layer.createNeuron(3,2);
      layer.getNeuronByIndex(2).gradient = 0.5;
      layer.getNeurons().forEach((neuron)=>{
        neuron.outputWeights.forEach((con, i)=>{
            con.weight = 0.3;
        });
      });
      neuron.outputWeights.forEach((con, i)=>{
          con.weight = 0.5;
      });

      expect(neuron.sumDOW(layer)).toBe(0.25);
    });
    it('should calc hidden gradien', () => {
      neuron.approximateFunction = () => {
        return 2;
      };
      let layer = new Layer();
      layer.createNeuron(3,0);
      layer.getNeuronByIndex(0).gradient = 0.3;
      layer.createNeuron(3,1);
      layer.getNeuronByIndex(1).gradient = 0.2;
      layer.createNeuron(3,2);
      layer.getNeuronByIndex(2).gradient = 0.5;
      layer.getNeurons().forEach((neuron)=>{
        neuron.outputWeights.forEach((con, i)=>{
            con.weight = 0.3;
        });
      });
      neuron.outputWeights.forEach((con, i)=>{
          con.weight = 0.5;
      });
      neuron.calcHiddenOutputGradients(layer)
      expect(neuron.getGradient()).toBe(0.5);
    });
    it('should update neuron weight', () => {
      neuron.approximateFunction = () => {
        return 2;
      };
      let layer = new Layer();
      layer.createNeuron(3,0);
      layer.getNeuronByIndex(0).gradient = 0.3;
      layer.createNeuron(3,1);
      layer.getNeuronByIndex(1).gradient = 0.2;
      layer.createNeuron(3,2);
      layer.getNeuronByIndex(2).gradient = 0.5;
      layer.getNeurons().forEach((neuron)=>{
        neuron.setOutputValue(1.3);
        neuron.outputWeights.forEach((con)=>{
            con.weight = 0.2;
            con.deltaWeight = 0.5;
        });
      });
      neuron.outputWeights.forEach((con)=>{
            con.deltaWeight = 0.2;
            con.weight = 0.7;
      });
      neuron.setOutputValue(0.5);
      neuron.gradient = 0.3;
      neuron.updateInputWeights(layer);
      expect(layer.getNeuronByIndex(neuron.index).getOutputWeightByIndex(neuron.index).getWeight()).toBe(0.5085);
    });
    it('should return connection', () => {
      neuron = new Neuron(2,1);
      neuron.outputWeights[0].weight = 1;
      expect(neuron.getOutputWeightByIndex(0).getWeight()).toBe(1);
    });
});