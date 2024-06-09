import request from 'supertest';
import app from '../main.js';

describe('Post /users', () => {
  describe('given password and username', () => {
    // should save the username and password in the database
    // should respond with a json object with userId
    // should respond with 200 status code
    test('should respond with a 200 status code', async () => {
      const response = await request(app).post('/users').send({
        username: 'test',
        password: 'test'
      });

      expect(response.statusCode).toBe(200);
    });

    // should specify json in the content type header
    test('should specify json in the content type header', async () => {
      const response = await request(app).post('/users').send({
        username: 'test',
        password: 'test'
      });
      console.log(response.headers);
      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      );
    });

    // test if the json returned is the user id to be number
    test('should return the user id to be number', async () => {
      const response = await request(app).post('/users').send({
        username: 'test',
        password: 'test'
      });

      expect(response.body.userId).toBeDefined();
      // or:
      // expect(response.body).toEqual({
      //   userId: expect.any(Number)
      // });
    });
  });

  describe('when the username or password is missing', () => {
    // should respond with 400 status code
    test('should respond with 400 status code no password', async () => {
      const response = await request(app).post('/users').send({
        username: 'test'
      });

      expect(response.statusCode).toBe(400);
    });

    test('should respond with 400 status code no username', async () => {
      const response = await request(app).post('/users').send({
        password: 'test'
      });

      expect(response.statusCode).toBe(400);
    });

    test('should respond with 400 status code no password and no username', async () => {
      const response = await request(app).post('/users').send({});

      expect(response.statusCode).toBe(400);
    });
  });
});
