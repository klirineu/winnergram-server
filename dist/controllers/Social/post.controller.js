"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _postservice = require('../../services/Social/post.service');



class PostController {
    static __initStatic() {this.newPost = async (req, res) => {
        try {
            const createPost = await _postservice.PostService.newPost({...req.body, author: req.user, file: 'no image'});
            
            res.status(200).json(createPost)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: "error",
                    msg: "Internal Server Error."
                })
        }
    }}
    static __initStatic2() {this.postWithImage = async (req, res) => {
        try {
            const createPost = await _postservice.PostService.newPost({...req.body, author: req.user, file: req.file.key + '.webp'});
            
            res.status(200).json(createPost)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: "error",
                    msg: "Internal Server Error."
                })
        }
    }}

    static __initStatic3() {this.postWithVideo = async (req, res) => {
        try {

           const createPost = await _postservice.PostService.newPost({...req.body, author: req.user, file: req.file.key.split("/").pop() })
           
            res.status(200).json(createPost)
        } catch (error) {
            console.log(error)
        }
    }}

    static __initStatic4() {this.getSinglePost = async (req, res) => {
        const { postid } = req.params;
        try {
            const Post = await _postservice.PostService.getSinglePost(postid);
            
            return res.status(200).json(Post)
        } catch (e) {
            if (e.statusCode) return res.status(e.statusCode).json({status: "error", msg: e.message});

            console.log(e)
            return res.status(500).json({status: "error", msg: "Internal Server Error"});
        }
    }}
} PostController.__initStatic(); PostController.__initStatic2(); PostController.__initStatic3(); PostController.__initStatic4();


exports.PostController = PostController;