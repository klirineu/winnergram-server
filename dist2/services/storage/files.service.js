import { dbSync } from "../../configs/dbSync";
import createError from "http-errors";
import { getFileStream } from "../../modules/readStream.module";

class FileService {
    static async getAvatar(username) {
        const avatarKey = await dbSync.accounts.findFirst({
            where: {
                OR: [{ username: username }, { id: username }],
            },
            select: {
                Personal: {
                    select: {
                        avatar: true,
                    },
                },
            },
        });
        if (!avatarKey)
            throw createError.NotFound("Avatar for this user has not exist.");
        const retriveImage = getFileStream(
            "avatars",
            avatarKey.Personal[0].avatar
        );

        retriveImage.on("error", (e) => {
            throw createError.InternalServerError(
                "It looks like there was an error displaying the user image."
            );
        });

        return retriveImage;
    }

    static async getPostImage(postid) {
        const imageKey = await dbSync.posts.findUnique({
            where: {
                id: postid,
            },
        });
        if (!imageKey) throw createError.NotFound("Post not exist.");
        if (imageKey.isImage === false)
            throw createError.NotFound("Image for this post has not exist.");
        const retriveImage = getFileStream("posts/images", imageKey.file);

        retriveImage.on("error", (e) => {
            if (e.code === "TimeoutError")
                return console.log("Timeout na imagem...");
            //    throw createError.InternalServerError('It looks like there was an error displaying the post image.');
        });

        return retriveImage;
    }

    static async getPostVideo(postid) {
        const videoKey = await dbSync.posts.findUnique({
            where: {
                id: postid,
            },
        });
        if (!videoKey) throw createError.NotFound("Post not exist.");
        if (videoKey.isVideo === false)
            throw createError.NotFound("Video for this post has not exist.");
        const retriveVideo = getFileStream("posts/videos", videoKey.file);

        retriveVideo.on("error", (e) => {
            if (e.code === "TimeoutError")
                return console.log("Timeout no video...");
            // throw createError.InternalServerError('It looks like there was an error displaing the post video');
        });

        return retriveVideo;
    }
}

export { FileService };
