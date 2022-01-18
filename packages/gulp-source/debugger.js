const path = require('path');
const rollup = require('./libs/lib/rollup');
let entry = path.resolve(__dirname, 'libs/main.js');
rollup(entry, 'bundle.js');
