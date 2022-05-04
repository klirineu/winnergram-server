"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dbSync = require('../../configs/dbSync');
var _bull = require('../../lib/bull'); var _bull2 = _interopRequireDefault(_bull);

class CommentService {
    static async Comment(data) {
        const { postid, content, author } = data;
        const Comment = await _dbSync.dbSync.comments.create({
            data: {
                content: content,
                post: postid,
                author: author,
            },
        });

        const getUser = await _dbSync.dbSync.accounts.findUnique({
            where: {
                id: author,
            },
            select: {
                username: true,
            },
        });

        const findPost = await _dbSync.dbSync.posts.findUnique({
            where: {
                id: postid,
            },
            select: {
                author: true,
            },
        });

        const findAuthor = await _dbSync.dbSync.accounts.findUnique({
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
                    await _bull2.default.add("PushNotificationsJob", {
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

exports.CommentService = CommentService;
