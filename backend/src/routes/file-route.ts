import express from "express";
import multer from "multer";

const router = express.Router();

const base = "http://127.0.0.1:3010";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/file:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server and returns its URL.
 *     tags:
 *       - File Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "http://127.0.0.1:3010/public/1710859123456.jpg"
 *       400:
 *         description: No file uploaded
 */
router.post('/', upload.single("file"), function (req, res) {
    if (!req.file) {
        res.status(400).send({ error: "No file uploaded" })
    }
    console.log("router.post(/file: " + base + req.file?.path)
    res.status(200).send({ url: base + "/" + req.file?.path })
});
export default router;