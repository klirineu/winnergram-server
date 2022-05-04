import { FollowService } from "../../services/Social/follow.service";

class FollowController {
    static Follow = async (req, res) => {
        const { memberid } = req.params;
        try {
            const checkFollowing = await FollowService.checkFollow(
                memberid,
                req.user
            );
            if (checkFollowing)
                return res
                    .status(400)
                    .json({ status: "error", msg: "Aleardy Follow this user" });

            const FollowUser = await FollowService.Follow(memberid, req.user);

            return res.status(200).json(FollowUser);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };

    static unFollow = async (req, res) => {
        const { memberid } = req.params;
        try {
            const checkFollowing = await FollowService.checkFollow(
                memberid,
                req.user
            );
            if (!checkFollowing)
                return res.status(400).json({
                    status: "error",
                    msg: "Not Following this user",
                });

            const unFollowUser = await FollowService.unFollow(
                memberid,
                req.user
            );

            return res.status(200).json(unFollowUser);
        } catch (error) {
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };

    static isFollowing = async (req, res) => {
        const { memberid } = req.params;
        try {
            const isFollowingUser = await FollowService.checkFollow(
                memberid,
                req.user
            );

            res.status(200).json({
                meta: isFollowingUser,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };

    static getUserFollowing = async (req, res) => {
        const { username } = req.params;
        try {
            const Followers = await FollowService.getFollowingUsersData({
                username,
            });

            return res.status(200).json(Followers);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", msg: e.message });
            console.log(e);

            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    };
}

export { FollowController };
