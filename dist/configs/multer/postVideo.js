"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require("dotenv").config();


var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multers3 = require('multer-s3'); var _multers32 = _interopRequireDefault(_multers3);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);
const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;


var videoStorage = _multer2.default.call(void 0, {
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "video/mp4",
          ];

          if (allowedMimes.includes(file.mimetype)) {
              cb(null, true);
          } else {
              cb(_httperrors2.default[410]("This file type is not supported."));
          }
    },
    storage: _multers32.default.call(void 0, {
        
        s3: new _awssdk2.default.S3({ region, accessKeyId, secretAccessKey, signatureVersion: 'v4' }),
        bucket: bucketName,
        contentType: _multers32.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            _crypto2.default.randomBytes(10, (err, hash) => {
                if (err) cb(err);
                const filename = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, 'posts/videos' + "/" + filename);
            })
        }
    })
});


exports.videoStorage = videoStorage;