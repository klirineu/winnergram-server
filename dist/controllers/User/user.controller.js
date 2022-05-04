"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _userservice = require('../../services/User/user.service');

class DataController {
    static __initStatic() {this.getUser = async (req, res) => {
        const { username } = req.params;

        try {
            const User = await _userservice.DataService.getUser({ username });

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
    }}

    static __initStatic2() {this.getUsers = async (req, res) => {
        try {
            const Users = await _userservice.DataService.getUsers();

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
    }}

    static __initStatic3() {this.getUserFeed = async (req, res) => {
        const { username } = req.params;

        try {
            const Feed = await _userservice.DataService.getUserFeed({ username });

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
    }}

    static __initStatic4() {this.getUserPosts = async (req, res) => {
        const { username } = req.params;
        try {
            const Posts = await _userservice.DataService.getUserPosts({ username });

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
    }}
} DataController.__initStatic(); DataController.__initStatic2(); DataController.__initStatic3(); DataController.__initStatic4();

exports.DataController = DataController;
