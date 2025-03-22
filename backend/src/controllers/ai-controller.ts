import { Request, Response } from "express";
import config from "../config/config";
import NodeCache from 'node-cache';
import axios from 'axios';

// Cache for storing generated captions (30 minutes TTL)
const captionCache = new NodeCache({ stdTTL: 1800 });

const generateCaption = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.status(config.statusCode.BAD_REQUEST).json({
                error: "Please provide a prompt for the caption"
            });
            return;
        }

        // Check cache first
        const cachedCaption = captionCache.get(prompt);
        if (cachedCaption) {
            res.status(config.statusCode.SUCCESS).json({ caption: cachedCaption });
            return;
        }

        // Define fallback models
        const models = [
            'gpt2',
            'distilgpt2',
            'facebook/opt-125m'
        ];

        let caption = null;
        let lastError = null;

        // Try each model until one works
        for (const model of models) {
            try {
                const response = await axios.post(
                    `https://api-inference.huggingface.co/models/${model}`,
                    {
                        inputs: `Create a creative Instagram caption about: ${prompt}`,
                        parameters: {
                            max_length: 100,
                            temperature: 0.7,
                            return_full_text: false
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000
                    }
                );

                caption = response.data[0]?.generated_text?.trim();
                if (caption) {
                    break; // Exit loop if we got a valid response
                }
            } catch (error) {
                console.error(`Error with model ${model}:`, error);
                lastError = error;
                continue; // Try next model
            }
        }

        // If all models failed, use a simple fallback
        if (!caption) {
            caption = `✨ ${prompt}`;
        }

        // Store in cache
        captionCache.set(prompt, caption);

        res.status(config.statusCode.SUCCESS).json({ caption });
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(config.statusCode.INTERNAL_SERVER_ERROR).json({
            error: "Failed to generate caption",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export default {
    generateCaption
}; 