import { dbSync } from "../../configs/dbSync";
import createError from "http-errors";
import stringGenerator from "string-random";
import { DataService } from "../User/user.service";
import bull from "../../lib/bull";

class FollowService {
    static async Follow(userid, authorid) {
        const getRoomID = await dbSync.follows.findMany();
        const isRoomAleardyExist = getRoomID.filter(
            (room) => room.author === userid && room.member === authorid
        );

        if (!isRoomAleardyExist.length) {
            const generated = stringGenerator(50);
            const UserFollow = await dbSync.accounts.findUnique({
                where: {
                    id: userid,
                },
                select: {
                    pushToken: true,
                    Settings: true,
                },
            });
            let FollowUser = await dbSync.accounts.update({
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
                    await bull.add("PushNotificationsJob", {
                        title: "Novo Seguidor",
                        to: UserFollow.pushToken,
                        sound: "default",
                        body: `@${FollowUser.username} agora segue você.`,
                        priority: "high",
                    });
                }
            }

            await dbSync.direct.create({
                data: {
                    author: authorid,
                    member: userid,
                    room: generated,
                },
            });

            return FollowUser;
        } else {
            const UserFollow = await dbSync.accounts.findUnique({
                where: {
                    id: userid,
                },
                select: {
                    pushToken: true,
                    Settings: true,
                },
            });

            let FollowUser = await dbSync.accounts.update({
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
                    await bull.add("PushNotificationsJob", {
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
        let getFollowUser = await dbSync.follows.findFirst({
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
        const unFollowUser = await dbSync.follows.delete({
            where: { id: getFollowUser.id },
        });

        return unFollowUser;
    }

    static async checkFollow(userid, authorid) {
        let isCheck = await dbSync.follows.findFirst({
            where: {
                author: authorid,
                member: userid,
            },
        });

        return isCheck ? true : false;
    }

    static async getFollowingUsersData(data) {
        const { username } = data;
        const Users = await dbSync.accounts.findUnique({
            where: {
                username: username,
            },
            select: {
                Follows: true,
            },
        });
        if (!Users)
            throw createError.NotFound(
                "Looks like this user dont follow anyone"
            );

        return Users;
    }
}

export { FollowService };
