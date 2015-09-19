var context = require.context('./test/network', true, /-spec\.js$/);
console.log(context, 'log');
context.keys().forEach(context);