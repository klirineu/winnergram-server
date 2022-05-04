require("dotenv").config();

import S3 from 'aws-sdk/clients/s3';

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_ENGINE;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY_ID;

const s3 = new S3({ region, accessKeyId, secretAccessKey });

const getFileStream = (folder, fileKey) => {
    if (!folder || !fileKey) return 'Invalid Arguments';

    const downloadParams = {
        Key: folder + '/' + fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}


export { getFileStream }