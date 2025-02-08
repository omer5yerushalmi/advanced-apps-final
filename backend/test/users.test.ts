import request from 'supertest';
import app from '../src/index';
import { connect, disconnect } from '../src/db';
import config from '../src/config/config';
import { User } from '../src/models/user';

let accessToken: string;
let userId: string;

beforeAll(async () => {
    await connect(config.mongoDB.uri);
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

    // Get the user ID for later tests
    const users = await User.find({});
    userId = users[0]._id.toString();
});

afterAll(async () => {
    await disconnect();
});

describe('Users', () => {
    describe('GET /users', () => {
        it('should get all users', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /users/:id', () => {
        it('should get user by id', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', userId);
            expect(response.body).toHaveProperty('email', 'test@example.com');
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get('/api/users/654321654321654321654321')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });

        it('should handle invalid user id format', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    email: 'newuser@example.com',
                    username: 'newuser',
                    password: 'Password123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('email', 'newuser@example.com');
            expect(response.body).toHaveProperty('username', 'newuser');
        });

        it('should fail with incomplete data', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    // Missing required fields
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user email', async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    email: 'updated@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email', 'updated@example.com');
        });

        it('should fail without email in request body', async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toBe('<email> is required.');
        });

        it('should handle non-existent user update', async () => {
            const response = await request(app)
                .put('/api/users/654321654321654321654321')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    email: 'nonexistent@example.com'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete user', async () => {
            // First create a user to delete
            const createResponse = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    email: 'todelete@example.com',
                    username: 'deleteuser',
                    password: 'Password123!'
                });

            const deleteUserId = createResponse.body._id;

            const response = await request(app)
                .delete(`/api/users/${deleteUserId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', deleteUserId);

            // Verify user is deleted
            const getResponse = await request(app)
                .get(`/api/users/${deleteUserId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(getResponse.status).toBe(404);
        });

        it('should handle non-existent user deletion', async () => {
            const response = await request(app)
                .delete('/api/users/654321654321654321654321')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });

        it('should handle invalid user id format for deletion', async () => {
            const response = await request(app)
                .delete('/api/users/invalid-id')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
        });
    });
}); 