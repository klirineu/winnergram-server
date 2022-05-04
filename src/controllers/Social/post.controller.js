import { PostService } from "../../services/Social/post.service"



class PostController {
    static newPost = async (req, res) => {
        try {
            const createPost = await PostService.newPost({...req.body, author: req.user, file: 'no image'});
            
            res.status(200).json(createPost)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: "error",
                    msg: "Internal Server Error."
                })
        }
    }
    static postWithImage = async (req, res) => {
        try {
            const createPost = await PostService.newPost({...req.body, author: req.user, file: req.file.key + '.webp'});
            
            res.status(200).json(createPost)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: "error",
                    msg: "Internal Server Error."
                })
        }
    }

    static postWithVideo = async (req, res) => {
        try {

           const createPost = await PostService.newPost({...req.body, author: req.user, file: req.file.key.split("/").pop() })
           
            res.status(200).json(createPost)
        } catch (error) {
            console.log(error)
        }
    }

    static getSinglePost = async (req, res) => {
        const { postid } = req.params;
        try {
            const Post = await PostService.getSinglePost(postid);
            
            return res.status(200).json(Post)
        } catch (e) {
            if (e.statusCode) return res.status(e.statusCode).json({status: "error", msg: e.message});

            console.log(e)
            return res.status(500).json({status: "error", msg: "Internal Server Error"});
        }
    }
}


export { PostController }