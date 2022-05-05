"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _followservice = require('../../services/Social/follow.service');

class FollowController {
    static __initStatic() {this.Follow = async (req, res) => {
        const { memberid } = req.params;
        try {
            const checkFollowing = await _followservice.FollowService.checkFollow(
                memberid,
                req.user
            );
            if (checkFollowing)
                return res
                    .status(400)
                    .json({ status: "error", msg: "Aleardy Follow this user" });

            const FollowUser = await _followservice.FollowService.Follow(memberid, req.user);

            return res.status(200).json(FollowUser);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    }}

    static __initStatic2() {this.unFollow = async (req, res) => {
        const { memberid } = req.params;
        try {
            const checkFollowing = await _followservice.FollowService.checkFollow(
                memberid,
                req.user
            );
            if (!checkFollowing)
                return res.status(400).json({
                    status: "error",
                    msg: "Not Following this user",
                });

            const unFollowUser = await _followservice.FollowService.unFollow(
                memberid,
                req.user
            );

            return res.status(200).json(unFollowUser);
        } catch (error) {
            return res
                .status(500)
                .json({ status: "error", msg: "Internal Server Error" });
        }
    }}

    static __initStatic3() {this.isFollowing = async (req, res) => {
        const { memberid } = req.params;
        try {
            const isFollowingUser = await _followservice.FollowService.checkFollow(
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
    }}

    static __initStatic4() {this.getUserFollowing = async (req, res) => {
        const { username } = req.params;
        try {
            const Followers = await _followservice.FollowService.getFollowingUsersData({
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
    }}
} FollowController.__initStatic(); FollowController.__initStatic2(); FollowController.__initStatic3(); FollowController.__initStatic4();

exports.FollowController = FollowController;
