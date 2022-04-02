// const data = require('./data.json');
const data = require('./data2.json');
const {testPushRelabel} = require('./test');
const {pushRelabel} = require('./pushRelabel');

const algo = new pushRelabel();

console.log('Result from npm module for maximum flow is:', testPushRelabel(data, 0, 5));
// console.log('Result from our module for maximum flow is:', algo.run(data));
// console.log('Table:', algo.run(data));
algo.run(data);