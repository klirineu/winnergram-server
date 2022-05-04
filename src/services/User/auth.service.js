import { dbSync } from "../../configs/dbSync";
import jwt from "../../modules/jwt.module";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { lowerAndSpaces } from "../../modules/formulateText.module";
import Bull from "../../lib/bull";
import stringGenerator from "string-random";

class AuthService {
    static async createUser(data) {
        const { username, email, pushToken, pass } = data;

        const User = await dbSync.accounts.create({
            data: {
                username: lowerAndSpaces(username),
                email: email,
                secretToken: stringGenerator(340),
                pushToken: pushToken,
                password: bcrypt.hashSync(pass, 8),
            },
        });

        User.password = undefined;
        User.token = await jwt.sign(User);

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
        const User = await dbSync.accounts.findFirst({
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

        if (!User) throw createError.NotFound("This user is not registered.");
        const testPass = bcrypt.compareSync(pass, User.password);

        if (!testPass)
            throw createError.Unauthorized("Invalid email or password.");

        User.password = undefined;
        const token = await jwt.sign(User);

        return { ...User, token };
    }

    static async authWithGoogle(data) {
        const { username, email, pass } = data;
        const checkAccount = await dbSync.accounts.findUnique({
            where: {
                email: email,
            },
        });

        if (!checkAccount) {
            const Auth = await dbSync.accounts.create({
                data: {
                    email: email,
                    username: username,
                    verified: true,
                    accountType: "GOOGLE",
                    secretToken: stringGenerator(340),
                    password: bcrypt.hashSync(pass, 8),
                },
            });

            Auth.password = undefined;
            Auth.token = await jwt.sign(Auth);

            return Auth;
        } else {
            const Auth = await dbSync.accounts.findUnique({
                where: {
                    email: email,
                },
            });

            const testPass = bcrypt.compareSync(pass, Auth.password);

            if (!testPass)
                throw createError.Unauthorized("Invalid email or password.");

            Auth.password = undefined;
            const token = await jwt.sign(Auth);

            return { ...Auth, token };
        }
    }

    static async RegistrationMail(data) {
        const { secretToken, id } = data;

        const User = await dbSync.accounts.findUnique({
            where: {
                id: id,
            },
        });

        if (!User) throw createError[404]("This user is not registered.");
        if (User.secretToken !== secretToken)
            throw createError[400](`This token is invalid for the user`);
        if (User.verified === true)
            throw createError[409](`This user is already verified.`);

        const verifyUpdate = await dbSync.accounts.update({
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

        const User = await dbSync.accounts.findUnique({
            where: {
                id: id,
            },
        });
        if (!User) throw createError[404]("This user is not registered.");
        if (User.verified === true)
            throw createError[409](`This user is already verified.`);

        await Bull.add({
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

export { AuthService };
