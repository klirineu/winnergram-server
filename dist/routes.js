"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
const Router = _express2.default.Router();

// Modules
var _profileAvatar = require('./configs/multer/profileAvatar'); var _profileAvatar2 = _interopRequireDefault(_profileAvatar);
var _postImage = require('./configs/multer/postImage'); var _postImage2 = _interopRequireDefault(_postImage);
var _postVideo = require('./configs/multer/postVideo');

// Middleware
var _guard = require('./middleware/guard');

// Controllers
var _authcontroller = require('./controllers/User/auth.controller');
var _usercontroller = require('./controllers/User/user.controller');
var _personalcontroller = require('./controllers/User/personal.controller');
var _filecontroller = require('./controllers/Storage/file.controller');
var _followcontroller = require('./controllers/Social/follow.controller');
var _postcontroller = require('./controllers/Social/post.controller');
var _likecontroller = require('./controllers/Social/like.controller');
var _commentcontroller = require('./controllers/Social/comment.controller');
var _directcontroller = require('./controllers/Social/direct.controller');

// Inital Route
Router.get("/", (req, res) => {
    res.sendFile(_path2.default.join(__dirname + "/configs/signature.txt"));
});

// User
Router.post("/users/register", _authcontroller.AuthController.createUser);
Router.post("/users/auth/google-oauth", _authcontroller.AuthController.authWithGoogle);

Router.get(
    "/users/register/:secretToken/:id/verify-email",
    _authcontroller.AuthController.RegistrationMail
);
Router.post(
    "/users/register/resend-email",
    _guard.Guard,
    _authcontroller.AuthController.ResendRegistrationMail
);
Router.get("/users/authenticate", _authcontroller.AuthController.loginUser);
Router.get("/users/:username", _usercontroller.DataController.getUser);
Router.get("/users/", _usercontroller.DataController.getUsers);
Router.get("/users/:username/feed", _usercontroller.DataController.getUserFeed);
Router.get("/users/:username/posts", _usercontroller.DataController.getUserPosts);
Router.get("/users/:username/following", _followcontroller.FollowController.getUserFollowing);
Router.get("/users/:username/avatar", _filecontroller.FileController.getAvatar);

Router.post(
    "/users/personal/create-personal",
    _guard.Guard,
    _profileAvatar2.default.single("image"),
    _personalcontroller.PersonalController.createPersonal
);

Router.get("/users/direct/r/:roomid", _directcontroller.DirectController.getDirectRoom);
Router.get("/users/direct/get-actives", _guard.Guard, _directcontroller.DirectController.getActiveRooms);

// Social
Router.patch(
    "/social/profile/:memberid/follow",
    _guard.Guard,
    _followcontroller.FollowController.Follow
);
Router.delete(
    "/social/profile/:memberid/unfollow",
    _guard.Guard,
    _followcontroller.FollowController.unFollow
);
Router.get(
    "/social/profile/:memberid/isFollow",
    _guard.Guard,
    _followcontroller.FollowController.isFollowing
);
Router.post("/social/feed/post/create-newpost", _guard.Guard, _postcontroller.PostController.newPost);
Router.post(
    "/social/feed/post/create-newpost/image",
    _guard.Guard,
    _postImage2.default.single("image"),
    _postcontroller.PostController.postWithImage
);

Router.post(
    "/social/feed/post/create-newpost/video",
    _guard.Guard,
    _postVideo.videoStorage.single("video"),
    _postcontroller.PostController.postWithVideo
);
Router.put(
    "/social/feed/post/create-newcomment",
    _guard.Guard,
    _commentcontroller.CommentController.Comment
);

Router.patch("/social/feed/post/:postid/like", _guard.Guard, _likecontroller.LikeController.Like);
Router.delete(
    "/social/feed/post/:postid/deslike",
    _guard.Guard,
    _likecontroller.LikeController.Deslike
);
Router.get("/social/feed/post/:postid/isLiked", _guard.Guard, _likecontroller.LikeController.isLiked);
Router.get("/social/feed/post/:postid/image", _filecontroller.FileController.getPostImage);
Router.get("/social/feed/post/:postid/video", _filecontroller.FileController.getPostVideo);
Router.get("/social/feed/post/:postid", _postcontroller.PostController.getSinglePost);

exports.Router = Router;
