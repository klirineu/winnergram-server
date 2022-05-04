import { LikeService } from "../../services/Social/like.service";

class LikeController {
    static Like = async (req, res) => {
        const { postid } = req.params;
        try {
            const LikePost = await LikeService.like({
                postid: postid,
                authorid: req.user,
            });

            return res.status(200).json(LikePost);
        } catch (e) {
            if (e.statusCode)
                return res.status(e.statusCode).json({
                    status: "error",
                    msg: e.message,
                });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error." });
        }
    };

    static Deslike = async (req, res) => {
        const { postid } = req.params;
        try {
            const DeslikePost = await LikeService.deslike({
                postid: postid,
                authorid: req.user,
            });

            return res.status(200).json(DeslikePost);
        } catch (e) {
            if (e.statusCode)
                return res.status(e.statusCode).json({
                    status: "error",
                    msg: e.message,
                });

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };

    static isLiked = async (req, res) => {
        const { postid } = req.params;
        const isPostLiked = await LikeService.isLiked({
            postid: postid,
            authorid: req.user,
        });

        return res.status(200).json({ meta: isPostLiked });
    };
}

export { LikeController };
