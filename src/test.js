import Net from './FunctionalNetwork/Network.js';

let networkParams  = {
    topology: [2,4,1],
    alpha: 0.5,
    eta: 0.15,
    recentAverageSmoothingFactor: 100
}

let network = Net.createNetwork(networkParams);

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
    for (let i = 0; i < 500000; i++) {
        let index = Math.floor(Math.random() * tableLength);
        table.push(table[index]);
    }
    console.info('create lessons',(new Date - t1));
    t1 = new Date();
    for (let i = 0; i < table.length; i++) {
        let data = table[i];
        Net.feedForward(data.input, network);
        Net.backProp(data.output, network);
    }
    console.info('learn',(new Date - t1));
    console.info(network.recentAverageError);
}


learn();
console.info(network)

window.network = Net;

