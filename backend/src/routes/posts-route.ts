import express, { Router } from "express";
import postsController from "../controllers/posts-controller";
import authenticate from "../common/auth_middleware";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')
      .filter(Boolean)
      .slice(1)
      .join('.')
    cb(null, Date.now() + "." + ext)
  }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *         - userName
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *         userName:
 *           type: string
 *           description: Name of the user who created the post
 *         text:
 *           type: string
 *           description: Content of the post
 *         imageUrl:
 *           type: string
 *           description: Optional URL of the post image
 *         createdAt:
 *           type: string
 *           description: Post creation timestamp
 *         updatedAt:
 *           type: string
 *           description: Post last update timestamp
 *       example:
 *         userId: '1'
 *         userName: 'john_doe'
 *         text: 'This is a sample post'
 *         createdAt: '2024-03-20T10:00:00Z'
 *         updatedAt: '2024-03-20T10:00:00Z'
 * 
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter posts by user ID
 *     responses:
 *       200:
 *         description: List of posts
 *       401:
 *         description: Unauthorized
 * 
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userName
 *               - text
 *             properties:
 *               userId:
 *                 type: string
 *               userName:
 *                 type: string
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 * 
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 * 
 *   put:
 *     summary: Update post text
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 * 
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 * 
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       404:
 *         description: Post not found
 */

const postsRoutes = (): Router => {
  const router = express.Router();

  router.get("/", authenticate, postsController.getAllPosts);
  router.get("/:id", authenticate, postsController.getPostById);
  router.put("/:id", authenticate, upload.single('image'), postsController.updatePost);
  router.delete("/:id", authenticate, postsController.deletePost);
  router.post("/", authenticate, upload.single('image'), postsController.createPost);
  router.post("/:id/like", authenticate, postsController.toggleLike);

  return router;
};

export default postsRoutes;
