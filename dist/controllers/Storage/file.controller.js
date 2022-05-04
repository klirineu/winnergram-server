"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _filesservice = require('../../services/Storage/files.service');


class FileController {
    static __initStatic() {this.getAvatar = async (req, res) => {
        const { username } = req.params;
        try {
            const userAvatar = await _filesservice.FileService.getAvatar(username);
           
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
    }}

    static __initStatic2() {this.getPostImage = async (req, res) => {
        const { postid } = req.params;
        try {
            const postImage = await _filesservice.FileService.getPostImage(postid);

            postImage.pipe(res)
            } catch (e) {
            if (e.statusCode) return res.status(e.statusCode).json({
                status: 'error',
                message: e.message
            });
            
            res.status(500).json({ status: "error", message: "Internal Server Error." });
        }
    }}
    static __initStatic3() {this.getPostVideo = async (req, res) => {
         const { postid } = req.params;
         try {
             const postVideo = await _filesservice.FileService.getPostVideo(postid);
             res.writeHead(200, {'Content-Type': 'video/mp4'});
             
             postVideo.pipe(res) 
            } catch (e) {
             if (e.statusCode) return res.status(e.statusCode).json({
                 status: 'error',
                 message: e.message
             });


             res.status(500).json({ status: "error", message: "Internal Server Error"});
         }


    }}
} FileController.__initStatic(); FileController.__initStatic2(); FileController.__initStatic3();

exports.FileController = FileController;