"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dbSync = require('../../configs/dbSync');
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _readStreammodule = require('../../modules/readStream.module');

class FileService {
    static async getAvatar(username) {
        const avatarKey = await _dbSync.dbSync.accounts.findFirst({
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
            throw _httperrors2.default.NotFound("Avatar for this user has not exist.");
        const retriveImage = _readStreammodule.getFileStream.call(void 0, 
            "avatars",
            avatarKey.Personal[0].avatar
        );

        retriveImage.on("error", (e) => {
            throw _httperrors2.default.InternalServerError(
                "It looks like there was an error displaying the user image."
            );
        });

        return retriveImage;
    }

    static async getPostImage(postid) {
        const imageKey = await _dbSync.dbSync.posts.findUnique({
            where: {
                id: postid,
            },
        });
        if (!imageKey) throw _httperrors2.default.NotFound("Post not exist.");
        if (imageKey.isImage === false)
            throw _httperrors2.default.NotFound("Image for this post has not exist.");
        const retriveImage = _readStreammodule.getFileStream.call(void 0, "posts/images", imageKey.file);

        retriveImage.on("error", (e) => {
            if (e.code === "TimeoutError")
                return console.log("Timeout na imagem...");
            //    throw createError.InternalServerError('It looks like there was an error displaying the post image.');
        });

        return retriveImage;
    }

    static async getPostVideo(postid) {
        const videoKey = await _dbSync.dbSync.posts.findUnique({
            where: {
                id: postid,
            },
        });
        if (!videoKey) throw _httperrors2.default.NotFound("Post not exist.");
        if (videoKey.isVideo === false)
            throw _httperrors2.default.NotFound("Video for this post has not exist.");
        const retriveVideo = _readStreammodule.getFileStream.call(void 0, "posts/videos", videoKey.file);

        retriveVideo.on("error", (e) => {
            if (e.code === "TimeoutError")
                return console.log("Timeout no video...");
            // throw createError.InternalServerError('It looks like there was an error displaing the post video');
        });

        return retriveVideo;
    }
}

exports.FileService = FileService;
