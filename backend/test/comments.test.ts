import request from 'supertest';
import app from '../src/index';
import { connect, disconnect } from '../src/db';
import config from '../src/config/config';
import { Comment } from '../src/models/comment';
import { Post } from '../src/models/post';
import { User } from '../src/models/user';

let accessToken: string;
let postId: string;

beforeAll(async () => {
    await connect(config.mongoDB.uri);
    await Comment.deleteMany({});
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

    // Create a post to comment on
    const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            content: 'Test post',
            sender: 'test@example.com'
        });

    postId = postResponse.body._id;
});

afterAll(async () => {
    await disconnect();
});

describe('Comments', () => {
    describe('POST /comments', () => {
        it('should create a new comment', async () => {
            const response = await request(app)
                .post('/api/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    post: postId,
                    content: 'Test comment',
                    sender: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('content', 'Test comment');
        });

        it('should fail with incomplete data', async () => {
            const response = await request(app)
                .post('/api/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    // Missing required fields
                });

            expect(response.status).toBe(400);
            expect(response.body).toBe('Incomplete comment data provided.');
        });
    });

    describe('PUT /comments/:id', () => {
        it('should fail without content', async () => {
            const response = await request(app)
                .put('/api/comments/123')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toBe('{content} is required.');
        });
    });

    describe('GET /comments', () => {
        it('should get all comments', async () => {
            const response = await request(app)
                .get('/api/comments')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('GET /comments/:id', () => {
        it('should handle invalid comment id', async () => {
            const response = await request(app)
                .get('/api/comments/invalid_id')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });
    });
}); 