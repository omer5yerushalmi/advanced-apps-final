import express, { Router } from "express";
import aiController from "../controllers/ai-controller";
import authenticate from "../common/auth_middleware";

const aiRoutes = (): Router => {
    const router = express.Router();

    router.post("/generate-caption",
        authenticate,
        aiController.generateCaption
    );

    return router;
};

export default aiRoutes; 