"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _dbSync = require('../../configs/dbSync');

class PersonalService {
    static async createPersonal(data) {
        const { fname, lname, age, avatar, userid } = data;
        let Personal = await _dbSync.dbSync.accounts.update({
            where: {
                id: userid,
            },
            data: {
                Settings: {
                    create: {
                        follows: true,
                        comments: true,
                        likes: true,
                        messages: true,
                    },
                },
                Personal: {
                    create: {
                        fname: fname,
                        lname: lname,
                        age: age,
                        avatar: avatar,
                    },
                },
            },
        });
        Personal.password = undefined;

        return Personal;
    }
}

exports.PersonalService = PersonalService;
