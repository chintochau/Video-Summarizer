import mongoose from "mongoose";


// Create a Schema for a blog post
const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Ensures no extra spaces
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Ensures unique URLs
    lowercase: true,
    trim: true,
    index: true, // Makes the slug searchable
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true, // The body/content of the post
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current time when the post is created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Can be updated whenever the post is modified
  },
  tags: {
    type: [String], // Array of tags for categorizing posts
    default: [],
  },
  published: {
    type: Boolean,
    default: true, // You can use this to indicate whether a post is live or in draft
  },
  image: {
    type: String, // URL or path to the image
  },
  type: {
    type: String,
    enum: ['blog', 'project','service'],
    default: 'blog',
  }
});

// Add a pre-save hook to update the `updatedAt` field on modification
BlogPostSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Create a model for the blog post schema
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;