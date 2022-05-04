require("dotenv").config();

import AWS from "aws-sdk"
import multer from "multer"
import S3SharpStorage from "multer-s3-sharp-resizer";

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;



const storage = new S3SharpStorage({
    s3: new AWS.S3({ region, accessKeyId, secretAccessKey, signatureVersion: 'v4' }),
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

export default multer({ storage });