import { FileService } from "../../services/Storage/files.service";


class FileController {
    static getAvatar = async (req, res) => {
        const { username } = req.params;
        try {
            const userAvatar = await FileService.getAvatar(username);
           
            userAvatar.pipe(res);
            } catch (e) {
            if (e.statusCode) return res.status(e.statusCode).json({
                status: 'error',
                message: e.message
            })

            res.status(500).json({
                status: "error",
                message: "Internal Server Error."
            });
        }
    }

    static getPostImage = async (req, res) => {
        const { postid } = req.params;
        try {
            const postImage = await FileService.getPostImage(postid);

            postImage.pipe(res)
            } catch (e) {
            if (e.statusCode) return res.status(e.statusCode).json({
                status: 'error',
                message: e.message
            });
            
            res.status(500).json({ status: "error", message: "Internal Server Error." });
        }
    }
    static getPostVideo = async (req, res) => {
         const { postid } = req.params;
         try {
             const postVideo = await FileService.getPostVideo(postid);
             res.writeHead(200, {'Content-Type': 'video/mp4'});
             
             postVideo.pipe(res) 
            } catch (e) {
             if (e.statusCode) return res.status(e.statusCode).json({
                 status: 'error',
                 message: e.message
             });


             res.status(500).json({ status: "error", message: "Internal Server Error"});
         }


    }
}

export { FileController }