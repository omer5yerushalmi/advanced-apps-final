import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { connect, disconnect } from "./db";
import config from "./config/config";
import errorHandler from './common/error-middleware';

import postsRoutes from "./routes/posts-route";
import commentsRoutes from "./routes/comments-route";
import usersRoutes from "./routes/users-route";
import authRoutes from "./routes/auth-route";
import createSwagger from "./common/swagger";

const app: Application = express();

app.use(express.json()); // Accept json body
app.use(cors());
app.use("/api/posts", postsRoutes());
app.use("/api/comments", commentsRoutes());
app.use("/api/users", usersRoutes());
app.use("/api/auth", authRoutes());

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});

createSwagger(app);

// Only start the server if we're not testing
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await connect(config.mongoDB.uri);

      app.listen(config.backend.port, () => {
        console.log(`Backend is running on port ${config.backend.port}`);
      });

      // Handle uncaught exceptions
      process.on("uncaughtException", async (error: Error) => {
        console.log("Uncaught Exception:", error);
        try {
          await disconnect();
          console.log("DB disconnect");
          process.exit(0);
        } catch (error) {
          console.log("Error while shutting down:", error);
          process.exit(1);
        }
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  })();
}

export default app;