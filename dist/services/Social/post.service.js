"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _dbSync = require('../../configs/dbSync');
var _formulateTextmodule = require('../../modules/formulateText.module');
class PostService {
    static async newPost (data) {
        const { author, content, file, hashtags, isImage, isVideo } = data;
        const newPost = await _dbSync.dbSync.posts.create({
            data: {
                author: author,
                content: content,
                file: file,
                hashtags: hashtags,
                isImage: _formulateTextmodule.stringToBoolean.call(void 0, isImage),
                isVideo: _formulateTextmodule.stringToBoolean.call(void 0, isVideo),
            }
        });


        return newPost;
    }

    static async getSinglePost(postid) {
        const Post = await _dbSync.dbSync.posts.findUnique({
            where: {
                id: postid
            },
            include: {
                Account: {
                    select: {
                        username: true,
                        Personal: true,
                    }
                },
                Likes: {
                    select: {
                        id: true,
                        post: true,
                        member: true,
                        liked_at: true,
                    }
                },
                Comments: {
                    select: {
                        id: true,
                        author: true,
                        content: true,
                        commented_at: true,
                        post: true,
                        Account: {
                            select: {
                                username: true,
                                Personal: true
                            }
                        }
                    }
                },
                _count: true
            }
        }); 

        if (!Post) throw createError.NotFound('This post does not exist in our database.');


        return {
            id: Post.id,
            username: Post.Account.username,
            author: Post.author,
            content: Post.content,
            file: Post.file,
            hashtags: Post.hashtags,
            isImage: Post.isImage,
            isVideo: Post.isVideo,
            postedAt: Post.posted_at,
            Likes: Post.Likes,
            Personal: {
                fname: Post.Account.Personal[0].fname,
                lname: Post.Account.Personal[0].lname,
                avatar: Post.Account.Personal[0].avatar
            },
            Comments: Post.Comments.map(comnt => ({
                id: comnt.id,
                username: comnt.Account.username,
                content: comnt.content,
                commentedAt: comnt.commented_at,
                fname: comnt.Account.Personal[0].fname,
                lname: comnt.Account.Personal[0].lname,
                avatar: comnt.Account.Personal[0].avatar,
            })),
            _count: Post._count
        }
    }
}

exports.PostService = PostService;