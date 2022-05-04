require("dotenv").config();


import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import crypto from "crypto";
import createError from "http-errors";
const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;


var videoStorage = multer({
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "video/mp4",
          ];

          if (allowedMimes.includes(file.mimetype)) {
              cb(null, true);
          } else {
              cb(createError[410]("This file type is not supported."));
          }
    },
    storage: multerS3({
        
        s3: new AWS.S3({ region, accessKeyId, secretAccessKey, signatureVersion: 'v4' }),
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            crypto.randomBytes(10, (err, hash) => {
                if (err) cb(err);
                const filename = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, 'posts/videos' + "/" + filename);
            })
        }
    })
});


export { videoStorage };