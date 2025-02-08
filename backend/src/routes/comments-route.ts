import express, { Router } from "express";
import commentsController from "../controllers/comments-controller";
import authenticate from "../common/auth_middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - post
 *         - sender
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         post:
 *           type: string
 *           description: ID of the related post
 *         sender:
 *           type: string
 *           description: Email of the comment sender
 *         content:
 *           type: string
 *           description: Content of the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Comment creation timestamp
 * 
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post
 *               - sender
 *               - content
 *             properties:
 *               post:
 *                 type: string
 *               sender:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 * 
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: post
 *         schema:
 *           type: string
 *         description: Filter comments by post ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 * 
 * /api/comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
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
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 * 
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
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
 *         description: Comment updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 * 
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
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
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

const commentsRoutes = (): Router => {
  const router = express.Router();

  router.post("/", authenticate, commentsController.createComment);
  router.get("/:id", authenticate, commentsController.getCommentById);
  router.get("/", authenticate, commentsController.getAllComments);
  router.put("/:id", authenticate, commentsController.updateComment);
  router.delete("/:id", authenticate, commentsController.deleteComment);

  return router;
};

export default commentsRoutes;
