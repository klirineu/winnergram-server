"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _push = require('../lib/push'); var _push2 = _interopRequireDefault(_push);

exports. default = {
    key: "PushNotificationsJob",
    async handle(data) {
        const { to, sound, body, priority, title } = data.data;
        _push2.default.sendPushNotificationsAsync([
            {
                to: to,
                sound: sound,
                title: title,
                body: body,
                priority: priority,
            },
        ]);
    },
};
