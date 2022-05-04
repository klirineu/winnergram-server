import express from "express";
import path from "path";
const Router = express.Router();

// Modules
import avatarStorage from "./configs/multer/profileAvatar";
import imagepostStorage from "./configs/multer/postImage";
import { videoStorage } from "./configs/multer/postVideo";

// Middleware
import { Guard } from "./middleware/guard";

// Controllers
import { AuthController } from "./controllers/User/auth.controller";
import { DataController } from "./controllers/User/user.controller";
import { PersonalController } from "./controllers/User/personal.controller";
import { FileController } from "./controllers/Storage/file.controller";
import { FollowController } from "./controllers/Social/follow.controller";
import { PostController } from "./controllers/Social/post.controller";
import { LikeController } from "./controllers/Social/like.controller";
import { CommentController } from "./controllers/Social/comment.controller";
import { DirectController } from "./controllers/Social/direct.controller";

// Inital Route
Router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/configs/signature.txt"));
});

// User
Router.post("/users/register", AuthController.createUser);
Router.post("/users/auth/google-oauth", AuthController.authWithGoogle);

Router.get(
    "/users/register/:secretToken/:id/verify-email",
    AuthController.RegistrationMail
);
Router.post(
    "/users/register/resend-email",
    Guard,
    AuthController.ResendRegistrationMail
);
Router.get("/users/authenticate", AuthController.loginUser);
Router.get("/users/:username", DataController.getUser);
Router.get("/users/", DataController.getUsers);
Router.get("/users/:username/feed", DataController.getUserFeed);
Router.get("/users/:username/posts", DataController.getUserPosts);
Router.get("/users/:username/following", FollowController.getUserFollowing);
Router.get("/users/:username/avatar", FileController.getAvatar);

Router.post(
    "/users/personal/create-personal",
    Guard,
    avatarStorage.single("image"),
    PersonalController.createPersonal
);

Router.get("/users/direct/r/:roomid", DirectController.getDirectRoom);
Router.get("/users/direct/get-actives", Guard, DirectController.getActiveRooms);

// Social
Router.patch(
    "/social/profile/:memberid/follow",
    Guard,
    FollowController.Follow
);
Router.delete(
    "/social/profile/:memberid/unfollow",
    Guard,
    FollowController.unFollow
);
Router.get(
    "/social/profile/:memberid/isFollow",
    Guard,
    FollowController.isFollowing
);
Router.post("/social/feed/post/create-newpost", Guard, PostController.newPost);
Router.post(
    "/social/feed/post/create-newpost/image",
    Guard,
    imagepostStorage.single("image"),
    PostController.postWithImage
);

Router.post(
    "/social/feed/post/create-newpost/video",
    Guard,
    videoStorage.single("video"),
    PostController.postWithVideo
);
Router.put(
    "/social/feed/post/create-newcomment",
    Guard,
    CommentController.Comment
);

Router.patch("/social/feed/post/:postid/like", Guard, LikeController.Like);
Router.delete(
    "/social/feed/post/:postid/deslike",
    Guard,
    LikeController.Deslike
);
Router.get("/social/feed/post/:postid/isLiked", Guard, LikeController.isLiked);
Router.get("/social/feed/post/:postid/image", FileController.getPostImage);
Router.get("/social/feed/post/:postid/video", FileController.getPostVideo);
Router.get("/social/feed/post/:postid", PostController.getSinglePost);

export { Router };
