"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _bull = require('../../lib/bull'); var _bull2 = _interopRequireDefault(_bull);
var _dbSync = require('../../configs/dbSync');

class LikeService {
    static async like(data) {
        const { postid, authorid } = data;
        const checkPostisAlive = await _dbSync.dbSync.posts.findFirst({
            where: {
                id: postid,
            },
        });
        if (!checkPostisAlive)
            throw _httperrors2.default[404]("This post no longer exists.");

        const checkIfAleardyLiked = await _dbSync.dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        if (checkIfAleardyLiked)
            throw _httperrors2.default[409]("Post has already been liked.");

        const likePost = await _dbSync.dbSync.posts.update({
            where: {
                id: postid,
            },
            data: {
                Likes: {
                    create: {
                        member: authorid,
                    },
                },
            },
        });

        const getUser = await _dbSync.dbSync.accounts.findUnique({
            where: {
                id: authorid,
            },
            select: {
                username: true,
            },
        });

        const PostAuthor = await _dbSync.dbSync.accounts.findUnique({
            where: {
                id: likePost.author,
            },
            select: {
                username: true,
                pushToken: true,
                Settings: true,
            },
        });

        if (authorid !== likePost.author) {
            if (PostAuthor.Settings[0].likes === true) {
                if (PostAuthor.pushToken !== "nothing") {
                    await _bull2.default.add("PushNotificationsJob", {
                        title: "Seu post foi curtido!",
                        to: PostAuthor.pushToken,
                        sound: "default",
                        body: `@${getUser.username} curtiu a sua postagem.`,
                        priority: "high",
                    });
                }
            }
        }

        return likePost;
    }

    static async deslike(data) {
        const { postid, authorid } = data;
        const checkPostisAlive = await _dbSync.dbSync.posts.findFirst({
            where: {
                id: postid,
            },
        });
        if (!checkPostisAlive)
            throw _httperrors2.default[404]("This post no longer exists.");

        const checkIfLiked = await _dbSync.dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        if (!checkIfLiked) throw _httperrors2.default[409]("This post was not liked");

        const deslikePost = await _dbSync.dbSync.likes.delete({
            where: {
                id: checkIfLiked.id,
            },
        });

        return deslikePost;
    }

    static async isLiked(data) {
        const { postid, authorid } = data;
        const checkPostLiked = await _dbSync.dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        return checkPostLiked ? true : false;
    }
}

exports.LikeService = LikeService;
