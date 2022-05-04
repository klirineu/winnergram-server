"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _commentservice = require('../../services/Social/comment.service');

class CommentController {
    static __initStatic() {this.Comment = async (req, res) => {
        try {
            const CommentPost = await _commentservice.CommentService.Comment({...req.body, author: req.user});

            return CommentPost
            } catch (e) {
               return res.status(500).json({status: "error", msg: "Internal Server Error"}); 
        }
    }}
} CommentController.__initStatic();

exports.CommentController = CommentController;