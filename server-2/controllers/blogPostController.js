import BlogPost from "../models/blogPostModel.js";
import {
  deleteFileFromS3,
  getAllFilesFromS3,
  uploadBlogFileToS3,
} from "../services/amazonService.js";
import fs from "fs";

export const createBlogPost = async (req, res) => {
  console.log("req.body", req.body);

  try {
    const blogPost = await BlogPost.create(req.body);
    return res.status(201).json(blogPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    return res.status(200).json(blogPosts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.body._id,
      { ...req.body, updatedAt: new Date() },
      {
        new: true,
      }
    );
    return res.status(200).json(blogPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    return res.status(200).json({ blogPost });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadBlogFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tempFilePath = file.path;
    const fileInfo = {
      fileName: file.originalname,
      fileType: file.mimetype,
    };
    const filePublicUrl = await uploadBlogFileToS3(tempFilePath, fileInfo);
    return res.status(200).json({
      success: true,
      filePublicUrl: filePublicUrl,
      fileName: file.originalname,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const getAllFiles = async (req, res) => {
  const downloadLink = "https://fusionaiwebcdn.s3.us-east-2.amazonaws.com/";
  try {
    const files = await getAllFilesFromS3();
    return res.status(200).json({
      files: files.map((file) => {
        return {
          name: file.Key,
          url: downloadLink + file.Key,
          size: file.Size,
          lastUploaded: file.LastModified,
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await deleteFileFromS3(req.body.fileName);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
