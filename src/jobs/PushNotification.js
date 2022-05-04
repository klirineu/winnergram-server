import push from "../lib/push";

export default {
    key: "PushNotificationsJob",
    async handle(data) {
        const { to, sound, body, priority, title } = data.data;
        push.sendPushNotificationsAsync([
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
