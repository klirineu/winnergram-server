"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _likeservice = require('../../services/Social/like.service');

class LikeController {
    static __initStatic() {this.Like = async (req, res) => {
        const { postid } = req.params;
        try {
            const LikePost = await _likeservice.LikeService.like({
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
    }}

    static __initStatic2() {this.Deslike = async (req, res) => {
        const { postid } = req.params;
        try {
            const DeslikePost = await _likeservice.LikeService.deslike({
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
    }}

    static __initStatic3() {this.isLiked = async (req, res) => {
        const { postid } = req.params;
        const isPostLiked = await _likeservice.LikeService.isLiked({
            postid: postid,
            authorid: req.user,
        });

        return res.status(200).json({ meta: isPostLiked });
    }}
} LikeController.__initStatic(); LikeController.__initStatic2(); LikeController.__initStatic3();

exports.LikeController = LikeController;
