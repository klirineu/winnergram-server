"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bull = require('bull'); var _bull2 = _interopRequireDefault(_bull);
var _redis = require('../configs/redis'); var _redis2 = _interopRequireDefault(_redis);
var _jobs = require('../jobs'); var jobs = _interopRequireWildcard(_jobs);

const queues = Object.values(jobs).map((job) => ({
    bull: new (0, _bull2.default)(job.key, _redis2.default),
    name: job.key,
    handle: job.handle,
}));

exports. default = {
    queues,
    add(name, data) {
        const queue = this.queues.find((queue) => queue.name === name);
        return queue.bull.add(data);
    },
    process() {
        return this.queues.forEach((queue) => {
            queue.bull.process(queue.handle);

            queue.bull.on("failed", (job, err) => {
                console.log("Job Failed", queue.key, job.data);
            });
        });
    },
};
