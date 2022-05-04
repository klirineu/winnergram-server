import createError from "http-errors";
import bull from "../../lib/bull";
import { dbSync } from "../../configs/dbSync";

class LikeService {
    static async like(data) {
        const { postid, authorid } = data;
        const checkPostisAlive = await dbSync.posts.findFirst({
            where: {
                id: postid,
            },
        });
        if (!checkPostisAlive)
            throw createError[404]("This post no longer exists.");

        const checkIfAleardyLiked = await dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        if (checkIfAleardyLiked)
            throw createError[409]("Post has already been liked.");

        const likePost = await dbSync.posts.update({
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

        const getUser = await dbSync.accounts.findUnique({
            where: {
                id: authorid,
            },
            select: {
                username: true,
            },
        });

        const PostAuthor = await dbSync.accounts.findUnique({
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
                    await bull.add("PushNotificationsJob", {
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
        const checkPostisAlive = await dbSync.posts.findFirst({
            where: {
                id: postid,
            },
        });
        if (!checkPostisAlive)
            throw createError[404]("This post no longer exists.");

        const checkIfLiked = await dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        if (!checkIfLiked) throw createError[409]("This post was not liked");

        const deslikePost = await dbSync.likes.delete({
            where: {
                id: checkIfLiked.id,
            },
        });

        return deslikePost;
    }

    static async isLiked(data) {
        const { postid, authorid } = data;
        const checkPostLiked = await dbSync.likes.findFirst({
            where: {
                post: postid,
                member: authorid,
            },
        });

        return checkPostLiked ? true : false;
    }
}

export { LikeService };
