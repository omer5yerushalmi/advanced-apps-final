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

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/default.jpg`;
        console.log(filePath);
        try {
            const response = await request(app)
                .post("/api/file?file=test_file.jpg").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})