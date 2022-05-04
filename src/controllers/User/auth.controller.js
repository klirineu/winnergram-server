"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _authservice = require('../../services/User/auth.service');
var _dbSync = require('../../configs/dbSync');
var _googleauthlibrary = require('google-auth-library');

const client = new (0, _googleauthlibrary.OAuth2Client)(process.env.CLIENT_ID);

class AuthController {
    static __initStatic() {this.authWithGoogle = async (req, res) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.body.idToken,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();

            const GoogleAuth = await _authservice.AuthService.authWithGoogle({
                username: payload.email.match(/^.+(?=@)/)[0],
                email: payload.email,
                pass: payload.sub,
            });

            return res.status(200).json(GoogleAuth);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    }}

    static __initStatic2() {this.createUser = async (req, res) => {
        try {
            const User = await _authservice.AuthService.createUser(req.body);

            res.status(200).json(User);
        } catch (e) {
            if (e instanceof _dbSync.Prisma.PrismaClientKnownRequestError) {
                console.log(e.meta);
                return res.status(409).json({
                    status: "error",
                    msg: "Username or Email aleardy in use",
                    meta: e.meta.target,
                });
            }
            console.log(e.meta);
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    }}

    static __initStatic3() {this.loginUser = async (req, res) => {
        const [, hash] = req.headers.authorization.split(" ");
        const [email, pass] = Buffer.from(hash, "base64").toString().split(":");
        try {
            const User = await _authservice.AuthService.loginUser({ email, pass });

            res.status(200).json(User);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    }}

    static __initStatic4() {this.RegistrationMail = async (req, res) => {
        const { secretToken, id } = req.params;
        try {
            const ConfirmRegistration = await _authservice.AuthService.RegistrationMail({
                secretToken,
                id,
            });

            return res.status(200).json(ConfirmRegistration);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    }}

    static __initStatic5() {this.ResendRegistrationMail = async (req, res) => {
        try {
            const ResendRegistration =
                await _authservice.AuthService.resendRegistrationEmail({ id: req.user });

            return res.status(200).json(ResendRegistration);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    }}
} AuthController.__initStatic(); AuthController.__initStatic2(); AuthController.__initStatic3(); AuthController.__initStatic4(); AuthController.__initStatic5();

exports.AuthController = AuthController;
