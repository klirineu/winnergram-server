"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _dbSync = require('../../configs/dbSync');

class DataService {
    static async getUser(data) {
        const { username } = data;
        let User = await _dbSync.dbSync.accounts.findFirst({
            where: {
                OR: [{ id: username }, { username: username }],
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                verified: true,
                password: false,
                Personal: true,
                _count: true,
            },
        });

        if (!User)
            throw _httperrors2.default.NotFound(
                "This user does not exist in our database."
            );
        const Followers = await _dbSync.dbSync.follows.findMany({
            where: { member: User.id },
        });

        User.Personal = User.Personal[0];
        return {
            ...User,
            _count: { ...User._count, Followers: Followers.length },
        };
    }

    static async getUsers() {
        let Users = await _dbSync.dbSync.accounts.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                verified: false,
                password: false,
                Personal: true,
                _count: true,
            },
        });
        if (!Users) throw _httperrors2.default.NotFound("Unable to receive users.");

        for (let User of Users) {
            User.password = undefined;
            User.Personal = User.Personal[0];
        }

        return Users.filter((user) => user.Personal);
    }

    // Social
    static async getUserFeed(data) {
        const { username, user } = data;
        const User = await _dbSync.dbSync.accounts.findFirst({
            where: {
                username: username,
            },
            select: {
                id: true,
                Follows: true,
            },
        });
        if (!User)
            throw _httperrors2.default[400]("This user does not exist in our database.");

        const FollowingMembers = User.Follows.map((follow) => {
            return follow.member;
        });
        if (!FollowingMembers.length)
            throw _httperrors2.default.NotFound(
                "It looks like this user is not following anyone."
            );

        const Posts = await _dbSync.dbSync.posts.findMany({
            orderBy: {
                posted_at: "desc",
            },
            where: {
                author: {
                    in: [...FollowingMembers, User.id],
                },
            },
            include: {
                Account: {
                    select: {
                        username: true,
                        Personal: true,
                    },
                },
                Likes: {
                    select: {
                        id: true,
                        post: false,
                        member: true,
                        liked_at: true,
                    },
                },
                Comments: {
                    select: {
                        id: true,
                        author: true,
                        content: true,
                        commented_at: true,
                        post: true,
                    },
                },
                _count: true,
            },
        });
        if (!Posts.length)
            throw _httperrors2.default.NotFound("User with no posts in feed.");

        return Posts.map((post) => ({
            id: post.id,
            username: post.Account.username,
            author: post.author,
            content: post.content,
            file: post.file,
            hashtags: post.hashtags,
            isImage: post.isImage,
            isVideo: post.isVideo,
            postedAt: post.posted_at,
            Personal: {
                fname: post.Account.Personal[0].fname,
                lname: post.Account.Personal[0].lname,
                avatar: post.Account.Personal[0].avatar,
            },
            Likes: post.Likes,
            Comments: post.Comments,
            _count: post._count,
        }));
    }

    static async getUserPosts(data) {
        const { username } = data;
        const User = await _dbSync.dbSync.accounts.findFirst({
            where: {
                username: username,
            },
            select: {
                id: true,
                Follows: true,
            },
        });
        if (!User)
            throw _httperrors2.default.NotFound(
                "This user does not exist in our database."
            );

        const Posts = await _dbSync.dbSync.posts.findMany({
            orderBy: {
                posted_at: "desc",
            },
            where: {
                author: User.id,
            },
            include: {
                Account: {
                    select: {
                        username: true,
                        Personal: true,
                    },
                },
                Likes: {
                    select: {
                        id: true,
                        post: true,
                        member: true,
                        liked_at: true,
                    },
                },
                Comments: {
                    select: {
                        id: true,
                        author: true,
                        content: true,
                        commented_at: true,
                        post: true,
                    },
                },
                _count: true,
            },
        });
        if (!Posts.length) throw _httperrors2.default.NotFound("User with no posts.");

        return Posts.map((post) => ({
            id: post.id,
            username: post.Account.username,
            author: post.author,
            content: post.content,
            file: post.file,
            hashtags: post.hashtags,
            isImage: post.isImage,
            isVideo: post.isVideo,
            postedAt: post.posted_at,
            Personal: {
                fname: post.Account.Personal[0].fname,
                lname: post.Account.Personal[0].lname,
                avatar: post.Account.Personal[0].avatar,
            },
            Likes: post.Likes,
            Comments: post.Comments,
            _count: post._count,
        }));
    }
}

exports.DataService = DataService;
