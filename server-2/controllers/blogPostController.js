import BlogPost from "../models/blogPostModel.js";

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
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
