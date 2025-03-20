import request from 'supertest';
import app from '../src/index';
import { connect, disconnect } from '../src/db';
import config from '../src/config/config';
import { Post } from '../src/models/post';
import { User } from '../src/models/user';

let accessToken: string;

beforeAll(async () => {
    await connect(config.mongoDB.uri);
    await Post.deleteMany({});
    await User.deleteMany({});

    // Register and login to get access token
    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'test@example.com',
            password: 'Password123!',
            username: 'testuser'
        });

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'Password123!'
        });

    accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
    await disconnect();
});

describe('Posts', () => {
    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    userId: '1',
                    userName: 'test_user',
                    text: 'Test post'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('text', 'Test post');
            expect(response.body).toHaveProperty('userId', '1');
            expect(response.body).toHaveProperty('userName', 'test_user');
        });

        it('should fail with incomplete data', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toBe('Incomplete post data provided.');
        });

        test("create post with image", async () => {
            const filePath = `${__dirname}/default.jpg`;

            try {
                const response = await request(app)
                    .post("/api/posts")
                    .field('userId', 'testUser123')
                    .field('userName', 'Test User')
                    .field('text', 'Post with image')
                    .attach('image', filePath)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(response.statusCode).toEqual(200);
                expect(response.body).toHaveProperty('imageUrl');
                expect(response.body.imageUrl).toContain('public');
                expect(response.body.text).toEqual('Post with image');

                // Verify the image is accessible
                const imageUrl = response.body.imageUrl.replace(/^.*\/\/[^/]+/, '');
                const imageRes = await request(app).get(imageUrl);
                expect(imageRes.statusCode).toEqual(200);
            } catch (err) {
                console.log(err);
                expect(1).toEqual(2);
            }
        });

        test("create post without image", async () => {
            const response = await request(app)
                .post("/api/posts")
                .field('userId', 'testUser123')
                .field('userName', 'Test User')
                .field('text', 'Post without image')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toEqual(200);
            expect(response.body.imageUrl).toBeUndefined();
            expect(response.body.text).toEqual('Post without image');
        });
    });

    describe('GET /posts', () => {
        it('should get all posts', async () => {
            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('PUT /posts/:id', () => {
        it('should fail without text', async () => {
            const response = await request(app)
                .put('/api/posts/123')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toBe('{text} is required.');
        });
    });

    describe('GET /posts/:id', () => {
        it('should handle invalid post id', async () => {
            const response = await request(app)
                .get('/api/posts/invalid_id')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });
    });
}); 