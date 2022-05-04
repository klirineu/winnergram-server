import { DataService } from "../../services/User/user.service";

class DataController {
    static getUser = async (req, res) => {
        const { username } = req.params;

        try {
            const User = await DataService.getUser({ username });

            res.status(200).json(User);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });

            res.status(500).json({
                status: "error",
                msg: "Internal Server Error.",
            });
        }
    };

    static getUsers = async (req, res) => {
        try {
            const Users = await DataService.getUsers();

            res.status(200).json(Users);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });

            res.status(500).json({
                status: "error",
                msg: "Internal Server Error.",
            });
        }
    };

    static getUserFeed = async (req, res) => {
        const { username } = req.params;

        try {
            const Feed = await DataService.getUserFeed({ username });

            return res.status(200).json(Feed);
        } catch (e) {
            if (e.statusCode === 404)
                return res.status(200).json({
                    state: "success",
                    msg: e.message,
                    code: 404,
                });

            if (e.statusCode !== 404)
                return res.status(e.statusCode).json({
                    state: "error",
                    msg: e.message,
                });

            res.status(500).json({
                state: "error",
                msg: "Internal Server Error",
            });
        }
    };

    static getUserPosts = async (req, res) => {
        const { username } = req.params;
        try {
            const Posts = await DataService.getUserPosts({ username });

            return res.status(200).json(Posts);
        } catch (e) {
            if (e.statusCode === 404)
                return res
                    .status(200)
                    .json({ state: "success", msg: e.message, code: 404 });

            if (e.statusCode !== 404)
                return res
                    .status(e.statusCode)
                    .json({ state: "error", msg: e.message });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };
}

export { DataController };
