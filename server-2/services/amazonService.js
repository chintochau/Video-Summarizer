import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../config/amazonConfig.js";
import fs from "fs";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const Bucket = process.env.S3_BUCKET;
const CDNBucket = process.env.S3_CDN_BUCKET;

export const uploadAudioToS3 = async (tempFilePath, videoInfo) => {
  const authorName = videoInfo.videoDetails.author.name || "";
  const videoTitle = videoInfo.videoDetails.title || "audio";

  const file = fs.readFileSync(tempFilePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      ACL: "public-read",
      Bucket: Bucket,
      Key: videoTitle + authorName + ".webm",
      Body: file,
    },
  });

  const result = await upload.done();

  return result.Location;
};

export const uploadBlogFileToS3 = async (tempFilePath, fileInfo) => {
  const file = fs.readFileSync(tempFilePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      ACL: "public-read",
      Bucket: CDNBucket,
      Key: fileInfo.fileName,
      Body: file,
    },
  });

  const result = await upload.done();

  return result.Location;
};

export const getAllFilesFromS3 = async (bucket = CDNBucket) => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
  });
  const response = await s3Client.send(command);
  return response.Contents;
};
