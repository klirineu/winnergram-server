import { dbSync } from "../../configs/dbSync";
import bull from "../../lib/bull";

class CommentService {
    static async Comment(data) {
        const { postid, content, author } = data;
        const Comment = await dbSync.comments.create({
            data: {
                content: content,
                post: postid,
                author: author,
            },
        });

        const getUser = await dbSync.accounts.findUnique({
            where: {
                id: author,
            },
            select: {
                username: true,
            },
        });

        const findPost = await dbSync.posts.findUnique({
            where: {
                id: postid,
            },
            select: {
                author: true,
            },
        });

        const findAuthor = await dbSync.accounts.findUnique({
            where: {
                id: findPost.author,
            },
            select: {
                username: true,
                pushToken: true,
                Settings: true,
            },
        });

        if (author !== findPost.author) {
            if (findAuthor.Settings[0].comments === true) {
                if (findAuthor.pushToken !== "nothing") {
                    await bull.add("PushNotificationsJob", {
                        title: "Novo comentario!",
                        to: findAuthor.pushToken,
                        sound: "default",
                        body: `@${getUser.username} acaba de comentar, "${content}" em seu post.`,
                        priority: "high",
                    });
                }
            }
        }
        return Comment;
    }
}

export { CommentService };
