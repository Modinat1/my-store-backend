const { readFile } = require("node:fs/promises");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const S3 = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  //   s3ForcePathStyle: false,
});

const uploadFile = async (file) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "product-bucket2",
      Key: file.filename,
      Body: await readFile(file.path),
    });

    const response = await S3.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      return `https://product-bucket.t3.storage.dev/${file.filename}`;
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
