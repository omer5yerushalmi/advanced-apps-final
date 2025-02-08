import request from 'supertest';
import app from '../src/index';
import { connect, disconnect } from '../src/db';
import config from '../src/config/config';

describe('Auth Middleware', () => {
    beforeAll(async () => {
        await connect(config.mongoDB.uri);
    });

    afterAll(async () => {
        await disconnect();
    });

    it('should reject requests without authorization header', async () => {
        const response = await request(app)
            .get('/api/posts');

        expect(response.status).toBe(401);
        expect(response.body?.message).toBe('No authorization header');
    });

    it('should reject requests with malformed authorization header', async () => {
        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'malformed');

        expect(response.status).toBe(401);
        expect(response.body?.message).toBe('No token provided');
    });

    it('should reject requests with invalid token', async () => {
        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer invalid_token');

        expect(response.status).toBe(401);
        expect(response.body?.message).toBe('Invalid token');
    });
}); 