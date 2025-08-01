const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const { v4 } = require("uuid");

const S3 = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFile = async (file) => {
  const fileName = v4() + "." + file.mimetype.split("/")[1];
  try {
    const command = new PutObjectCommand({
      Bucket: "product-bucket",
      Key: fileName,
      Body: file.buffer,
    });

    const response = await S3.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      return `https://product-bucket.t3.storage.dev/${fileName}`;
    } else {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    throw new Error("File upload failed: " + error.message);
  }
};

module.exports = {
  uploadFile,
};
