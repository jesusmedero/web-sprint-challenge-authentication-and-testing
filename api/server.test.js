const request = require('supertest');
const server = require('./server'); 

describe('Auth Router - Register', () => {
  beforeEach(async () => {
    
  });

  test('[POST] /api/auth/register - success', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'user1', password: 'pass123' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'user1');
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

