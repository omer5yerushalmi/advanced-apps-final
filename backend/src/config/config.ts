import dotenv from "dotenv";

dotenv.config();

const config = {
  backend: {
    port: process.env.BACKEND_PORT || 3000,
  },
  mongoDB: {
    uri: process.env.MONGO_URI || "mongodb://root:dev@127.0.0.1/?authSource=admin",
  },
  statusCode: {
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
