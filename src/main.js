import Net from './Network.js';

let networkParams  = {
    topology: [2,4,1],
    alpha: 0.5,
    eta: 0.15,
    recentAverageSmoothingFactor: 100
}
let network = new Net(networkParams);

let table = [{
    input: [0,0],
    output: [0]
}, {
    input: [1,1],
    output: [0]
},{
    input: [1,0],
    output: [1]
},{
    input: [0,1],
    output: [1]
}];

function learn() {
    let tableLength = table.length;
    var t1 = new Date();
    for (let i = 0; i < 50000; i++) {
        let index = Math.floor(Math.random() * tableLength);
        table.push(table[index]);
    }
    console.info('create lessons',(new Date - t1));
    t1 = new Date();
    for (let i = 0; i < table.length; i++) {
        let data = table[i];
        network.feedForward(data.input);
        network.backProp(data.output);
    }
    console.info('learn',(new Date - t1));
    console.info(network.getRecentAverageError(), table.length);
}

learn();



window.network = network;

