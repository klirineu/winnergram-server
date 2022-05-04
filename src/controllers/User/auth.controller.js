import { AuthService } from "../../services/User/auth.service";
import { Prisma } from "../../configs/dbSync";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID);

class AuthController {
    static authWithGoogle = async (req, res) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.body.idToken,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();

            const GoogleAuth = await AuthService.authWithGoogle({
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
    };

    static createUser = async (req, res) => {
        try {
            const User = await AuthService.createUser(req.body);

            res.status(200).json(User);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
    };

    static loginUser = async (req, res) => {
        const [, hash] = req.headers.authorization.split(" ");
        const [email, pass] = Buffer.from(hash, "base64").toString().split(":");
        try {
            const User = await AuthService.loginUser({ email, pass });

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
    };

    static RegistrationMail = async (req, res) => {
        const { secretToken, id } = req.params;
        try {
            const ConfirmRegistration = await AuthService.RegistrationMail({
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
    };

    static ResendRegistrationMail = async (req, res) => {
        try {
            const ResendRegistration =
                await AuthService.resendRegistrationEmail({ id: req.user });

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
    };
}

export { AuthController };
