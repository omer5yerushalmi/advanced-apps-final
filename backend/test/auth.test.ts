import request from 'supertest';
import app from '../src/index';
import { connect, disconnect } from '../src/db';
import config from '../src/config/config';
import { User } from '../src/models/user';

beforeAll(async () => {
    await connect(config.mongoDB.uri);
    await User.deleteMany({});
});

afterAll(async () => {
    await disconnect();
});

describe('Auth', () => {
    describe('POST /auth/register', () => {
        it('should successfully register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                    username: 'testuser'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('email', 'test@example.com');
            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body).toHaveProperty('password');
        });

        it('should fail with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'Password123!',
                    username: 'testuser1'
                });

            // Duplicate registration
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'Password123!',
                    username: 'testuser2'
                });

            expect(response.status).toBe(400);
            expect(response.body?.message).toBe('User already exists.');
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Create a test user before login tests
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'login@example.com',
                    password: 'Password123!',
                    username: 'loginuser'
                });
        });

        it('should successfully login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'WrongPassword123!'
                });

            expect(response.status).toBe(400);
            expect(response.body?.message).toBe('Bad email or password.');
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(400);
            expect(response.body?.message).toBe('Bad email or password.');
        });
    });
});

