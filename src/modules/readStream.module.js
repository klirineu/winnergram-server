"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require("dotenv").config();

var _s3 = require('aws-sdk/clients/s3'); var _s32 = _interopRequireDefault(_s3);

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;

const s3 = new (0, _s32.default)({ region, accessKeyId, secretAccessKey });

const getFileStream = (folder, fileKey) => {
    if (!folder || !fileKey) return 'Invalid Arguments';

    const downloadParams = {
        Key: folder + '/' + fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}


exports.getFileStream = getFileStream;