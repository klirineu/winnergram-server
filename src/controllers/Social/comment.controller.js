import { CommentService } from "../../services/Social/comment.service";

class CommentController {
    static Comment = async (req, res) => {
        try {
            const CommentPost = await CommentService.Comment({...req.body, author: req.user});

            return CommentPost
            } catch (e) {
               return res.status(500).json({status: "error", msg: "Internal Server Error"}); 
        }
    }
}

export { CommentController };