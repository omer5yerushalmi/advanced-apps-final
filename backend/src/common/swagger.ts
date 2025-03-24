import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import config from "../config/config";
import express from "express";

const createSwagger = (app: express.Application) => {
    if (config.nodeEnv == "development") {
        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Web Dev 2022 REST API",
                    version: "1.0.0",
                    description: "REST server including authentication using JWT",
                },
                servers: [{ url: `http://localhost:${config.backend.port}`, },],
            },
            apis: ["./src/routes/*.ts"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));
    }
};

export default createSwagger;
