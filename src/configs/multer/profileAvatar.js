"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require("dotenv").config();

var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multers3sharpresizer = require('multer-s3-sharp-resizer'); var _multers3sharpresizer2 = _interopRequireDefault(_multers3sharpresizer);

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;



const storage = new (0, _multers3sharpresizer2.default)({
    s3: new _awssdk2.default.S3({ region, accessKeyId, secretAccessKey, signatureVersion: 'v4' }),
    bucket: bucketName,
    uploadOriginalImage: false,
    imageFormats: [
      {
        fileFormat: "webp",
        folder: 'avatars',
        resize: {
          width: 400,
          height: 400
        }
      }
    ]
});

exports. default = _multer2.default.call(void 0, { storage });