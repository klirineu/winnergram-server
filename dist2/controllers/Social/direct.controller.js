import e from "cors";
import { DirectService } from "../../services/Social/direct.service";

class DirectController {
    static getDirectRoom = async (req, res) => {
        const { roomid } = req.params;

        try {
            const Direct = await DirectService.getDirectRoom({
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
    };

    static getActiveRooms = async (req, res) => {
        try {
            const ActiveDirects = await DirectService.getActiveDirect({
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
    };
}

export { DirectController };
