"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv');
var _bull = require('./lib//bull'); var _bull2 = _interopRequireDefault(_bull);

_bull2.default.process();
console.log("wg:bull_queue ➜ is waiting for new jobs...");
