"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _directservice = require('../../services/Social/direct.service');

class DirectController {
    static __initStatic() {this.getDirectRoom = async (req, res) => {
        const { roomid } = req.params;

        try {
            const Direct = await _directservice.DirectService.getDirectRoom({
                roomid: roomid,
            });

            return res.status(200).json(Direct);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(e.statusCode)
                    .json({ status: "error", message: e.message });

            return res
                .status(500)
                .json({ error: "true", message: "Internal Server Error" });
        }
    }}

    static __initStatic2() {this.getActiveRooms = async (req, res) => {
        try {
            const ActiveDirects = await _directservice.DirectService.getActiveDirect({
                userid: req.user,
            });

            return res.status(200).json(ActiveDirects);
        } catch (e) {
            if (e.statusCode)
                return res
                    .status(200)
                    .json({ error: "true", message: e.message });

            return res
                .status(500)
                .json({ error: "true", message: "Internal Server Error" });
        }
    }}
} DirectController.__initStatic(); DirectController.__initStatic2();

exports.DirectController = DirectController;
