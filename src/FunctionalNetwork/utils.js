function getLast (arr) {
    return arr[arr.length - 1];
}

function getFirst (arr) {
    return arr[0];
}

let utils = {
    getLast: getLast,
    getFirst: getFirst
}

export default utils;