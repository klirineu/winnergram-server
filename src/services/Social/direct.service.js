"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _dbSync = require('../../configs/dbSync');
var _userservice = require('../User/user.service');

class DirectService {
    static async getDirectRoom(data) {
        const { roomid } = data;
        const getDirectRoom = await _dbSync.dbSync.direct.findUnique({
            where: {
                room: roomid,
            },
            select: {
                id: true,
                author: true,
                member: true,
                room: true,
                created_at: true,
                Messages: {
                    orderBy: {
                        created_at: "asc",
                    },
                    select: {
                        id: true,
                        author: true,
                        message: true,
                        room: true,
                        created_at: true,
                    },
                },
            },
        });

        if (!getDirectRoom) throw _httperrors2.default.NotFound("No direct room found");

        const author = await _userservice.DataService.getUser({
            username: getDirectRoom.author,
        });
        const member = await _userservice.DataService.getUser({
            username: getDirectRoom.member,
        });

        return {
            id: getDirectRoom.id,
            author: getDirectRoom.author,
            member: getDirectRoom.member,
            a_name: `${author.Personal.fname} ${author.Personal.lname}`,
            m_name: `${member.Personal.fname} ${member.Personal.lname}`,
            room: getDirectRoom.room,
            created_at: getDirectRoom.created_at,
            Messages: getDirectRoom.Messages,
        };
    }

    static async getActiveDirect(data) {
        const { userid } = data;
        const getActiveDirects = await _dbSync.dbSync.direct.findMany({
            orderBy: {
                created_at: "desc",
            },
            where: {
                OR: [{ author: userid }, { member: userid }],
            },
            select: {
                id: true,
                author: true,
                member: true,
                room: true,
                created_at: true,
                _count: true,
                Messages: {
                    orderBy: {
                        created_at: "desc",
                    },
                },
            },
        });
        if (!getActiveDirects)
            throw _httperrors2.default.notFound("No active direct rooms");

        return getActiveDirects
            .filter((direct) => direct._count.Messages > 0)
            .map((d) => ({
                id: d.id,
                author: d.author,
                member: d.member,
                room: d.room,
                created_at: d.created_at,
                Messages: d.Messages[0],
            }));
    }

    static async createNewmessage(data) {
        const { id, author, message, room } = data;
        const newMessage = await _dbSync.dbSync.messages.create({
            data: {
                id: id,
                author: author,
                message: message,
                room: room,
            },
        });

        return newMessage;
    }
}

exports.DirectService = DirectService;
