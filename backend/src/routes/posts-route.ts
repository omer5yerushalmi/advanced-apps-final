import express, { Router } from "express";
import postsController from "../controllers/posts-controller";
import authenticate from "../common/auth_middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         sender:
 *           type: string
 *           description: Email of the post sender
 *         content:
 *           type: string
 *           description: Content of the post
 *       example:
 *         sender: 'user@example.com'
 *         content: 'This is a sample post'
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
 *         name: sender
 *         schema:
 *           type: string
 *         description: Filter posts by sender email
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - sender
 *             properties:
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
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
 *     summary: Update post content
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
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
 */

const postsRoutes = (): Router => {
  const router = express.Router();

  router.get("/", authenticate, postsController.getAllPosts);
  router.get("/:id", authenticate, postsController.getPostById);
  router.put("/:id", authenticate, postsController.updatePost);
  router.delete("/:id", authenticate, postsController.deletePost);
  router.post("/", authenticate, postsController.createPost);

  return router;
};

export default postsRoutes;
