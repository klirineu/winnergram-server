"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _personalservice = require('../../services/User/personal.service');
var _dbSync = require('../../configs/dbSync');

class PersonalController {
    static async createPersonal (req, res) {
        const {fname, lname, age } = req.body

        try {
            const Personal = await _personalservice.PersonalService.createPersonal({fname, lname, age: parseInt(age), userid: req.user, avatar: req.file.key + '.webp' });
            
            res.status(200).json(Personal);
            } catch (e) {
                if (e instanceof _dbSync.Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') return res.status(409).json({status: 'error', msg: 'Conflict when creating the personal.'})
                }

                console.log(e)
                return res.status(500).json({statsus: 'error', msg: 'Internal Server Error.'})
        }
    }
};

exports.PersonalController = PersonalController;