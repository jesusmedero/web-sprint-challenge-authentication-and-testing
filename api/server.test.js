const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig'); 

afterEach(async () => {
  await db('users').truncate(); 
});

describe('Auth Router - Register', () => {
  test('[POST] /api/auth/register - success', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'unique_user_1', password: 'pass123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'unique_user_1');
    expect(res.body).toHaveProperty('password');
    expect(res.body.password).not.toBe('pass123');
  });

  test('[POST] /api/auth/register - missing username or password', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: '' });

    expect(res.status).toBe(400);
    expect(res.body).toMatch(/username and password required/i);
  });
});

describe('Auth Router - Login', () => {
  test('[POST] /api/auth/login - success', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'unique_user_2', password: 'pass123' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'unique_user_2', password: 'pass123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'welcome, unique_user_2');
    expect(res.body).toHaveProperty('token');
  });

  test('[POST] /api/auth/login - invalid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'nonexistent', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body).toMatch(/invalid credentials/i);
  });
});

describe('Jokes Router - Protected jokes endpoint', () => {
  test('[GET] /api/jokes - fails without token', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
    expect(res.body).toMatch(/token required/i);
  });

  test('[GET] /api/jokes - success with valid token', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'unique_user_3', password: 'pass123' });

    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'unique_user_3', password: 'pass123' });

    const token = loginRes.body.token;

    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
