"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dbSync = require('../../configs/dbSync');
var _jwtmodule = require('../../modules/jwt.module'); var _jwtmodule2 = _interopRequireDefault(_jwtmodule);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
var _formulateTextmodule = require('../../modules/formulateText.module');
var _bull = require('../../lib/bull'); var _bull2 = _interopRequireDefault(_bull);
var _stringrandom = require('string-random'); var _stringrandom2 = _interopRequireDefault(_stringrandom);

class AuthService {
    static async createUser(data) {
        const { username, email, pushToken, pass } = data;

        const User = await _dbSync.dbSync.accounts.create({
            data: {
                username: _formulateTextmodule.lowerAndSpaces.call(void 0, username),
                email: email,
                secretToken: _stringrandom2.default.call(void 0, 340),
                pushToken: pushToken,
                password: _bcrypt2.default.hashSync(pass, 8),
            },
        });

        User.password = undefined;
        User.token = await _jwtmodule2.default.sign(User);

        // await Bull.add({
        //     id: User.id,
        //     uniquehash: User.secretToken,
        //     name: User.username,
        //     email: User.email,
        // });

        return User;
    }

    static async loginUser(data) {
        const { email, pass } = data;
        const User = await _dbSync.dbSync.accounts.findFirst({
            where: {
                OR: [
                    {
                        email: email,
                    },
                    {
                        username: email,
                    },
                ],
            },
        });

        if (!User) throw _httperrors2.default.NotFound("This user is not registered.");
        const testPass = _bcrypt2.default.compareSync(pass, User.password);

        if (!testPass)
            throw _httperrors2.default.Unauthorized("Invalid email or password.");

        User.password = undefined;
        const token = await _jwtmodule2.default.sign(User);

        return { ...User, token };
    }

    static async authWithGoogle(data) {
        const { username, email, pass } = data;
        const checkAccount = await _dbSync.dbSync.accounts.findUnique({
            where: {
                email: email,
            },
        });

        if (!checkAccount) {
            const Auth = await _dbSync.dbSync.accounts.create({
                data: {
                    email: email,
                    username: username,
                    verified: true,
                    accountType: "GOOGLE",
                    secretToken: _stringrandom2.default.call(void 0, 340),
                    password: _bcrypt2.default.hashSync(pass, 8),
                },
            });

            Auth.password = undefined;
            Auth.token = await _jwtmodule2.default.sign(Auth);

            return Auth;
        } else {
            const Auth = await _dbSync.dbSync.accounts.findUnique({
                where: {
                    email: email,
                },
            });

            const testPass = _bcrypt2.default.compareSync(pass, Auth.password);

            if (!testPass)
                throw _httperrors2.default.Unauthorized("Invalid email or password.");

            Auth.password = undefined;
            const token = await _jwtmodule2.default.sign(Auth);

            return { ...Auth, token };
        }
    }

    static async RegistrationMail(data) {
        const { secretToken, id } = data;

        const User = await _dbSync.dbSync.accounts.findUnique({
            where: {
                id: id,
            },
        });

        if (!User) throw _httperrors2.default[404]("This user is not registered.");
        if (User.secretToken !== secretToken)
            throw _httperrors2.default[400](`This token is invalid for the user`);
        if (User.verified === true)
            throw _httperrors2.default[409](`This user is already verified.`);

        const verifyUpdate = await _dbSync.dbSync.accounts.update({
            where: {
                id: id,
            },
            data: {
                verified: true,
            },
        });

        User.password = undefined;
        User.secretToken = undefined;

        return verifyUpdate;
    }

    static async resendRegistrationEmail(data) {
        const { id } = data;

        const User = await _dbSync.dbSync.accounts.findUnique({
            where: {
                id: id,
            },
        });
        if (!User) throw _httperrors2.default[404]("This user is not registered.");
        if (User.verified === true)
            throw _httperrors2.default[409](`This user is already verified.`);

        await _bull2.default.add({
            id: User.id,
            uniquehash: User.secretToken,
            name: User.username,
            email: User.email,
        });

        User.password = undefined;
        User.secretToken = undefined;

        return User;
    }
}

exports.AuthService = AuthService;
