import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../config/amazonConfig.js";
import fs from "fs";

const Bucket = process.env.S3_BUCKET;

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
