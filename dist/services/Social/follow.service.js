"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dbSync = require('../../configs/dbSync');
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _stringrandom = require('string-random'); var _stringrandom2 = _interopRequireDefault(_stringrandom);
var _userservice = require('../User/user.service');
var _bull = require('../../lib/bull'); var _bull2 = _interopRequireDefault(_bull);

class FollowService {
    static async Follow(userid, authorid) {
        const getRoomID = await _dbSync.dbSync.follows.findMany();
        const isRoomAleardyExist = getRoomID.filter(
            (room) => room.author === userid && room.member === authorid
        );

        if (!isRoomAleardyExist.length) {
            const generated = _stringrandom2.default.call(void 0, 50);
            const UserFollow = await _dbSync.dbSync.accounts.findUnique({
                where: {
                    id: userid,
                },
                select: {
                    pushToken: true,
                    Settings: true,
                },
            });
            let FollowUser = await _dbSync.dbSync.accounts.update({
                where: {
                    id: authorid,
                },
                data: {
                    Follows: {
                        create: {
                            member: userid,
                            room: generated,
                        },
                    },
                },
            });

            if (UserFollow.Settings[0].follows === true) {
                if (UserFollow.pushToken !== "nothing") {
                    await _bull2.default.add("PushNotificationsJob", {
                        title: "Novo Seguidor",
                        to: UserFollow.pushToken,
                        sound: "default",
                        body: `@${FollowUser.username} agora segue você.`,
                        priority: "high",
                    });
                }
            }

            await _dbSync.dbSync.direct.create({
                data: {
                    author: authorid,
                    member: userid,
                    room: generated,
                },
            });

            return FollowUser;
        } else {
            const UserFollow = await _dbSync.dbSync.accounts.findUnique({
                where: {
                    id: userid,
                },
                select: {
                    pushToken: true,
                    Settings: true,
                },
            });

            let FollowUser = await _dbSync.dbSync.accounts.update({
                where: {
                    id: authorid,
                },
                data: {
                    Follows: {
                        create: {
                            member: userid,
                            room: isRoomAleardyExist[0].room,
                        },
                    },
                },
            });

            if (UserFollow.Settings[0].follows === true) {
                if (UserFollow.pushToken !== "nothing") {
                    await _bull2.default.add("PushNotificationsJob", {
                        title: "Novo Seguidor",
                        to: UserFollow.pushToken,
                        sound: "default",
                        body: `@${FollowUser.username} também começou a seguir você.`,
                        priority: "high",
                    });
                }
            }

            return FollowUser;
        }
    }

    static async unFollow(userid, authorid) {
        let getFollowUser = await _dbSync.dbSync.follows.findFirst({
            where: {
                member: userid,
                author: authorid,
            },
            select: {
                id: true,
                author: true,
                member: false,
            },
        });
        const unFollowUser = await _dbSync.dbSync.follows.delete({
            where: { id: getFollowUser.id },
        });

        return unFollowUser;
    }

    static async checkFollow(userid, authorid) {
        let isCheck = await _dbSync.dbSync.follows.findFirst({
            where: {
                author: authorid,
                member: userid,
            },
        });

        return isCheck ? true : false;
    }

    static async getFollowingUsersData(data) {
        const { username } = data;
        const Users = await _dbSync.dbSync.accounts.findUnique({
            where: {
                username: username,
            },
            select: {
                Follows: true,
            },
        });
        if (!Users)
            throw _httperrors2.default.NotFound(
                "Looks like this user dont follow anyone"
            );

        return Users;
    }
}

exports.FollowService = FollowService;
