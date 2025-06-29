const request = require('supertest');
const app = require('../../backend/src/index');

describe('Chat API', () => {
  describe('POST /api/v1/chat', () => {
    it('should process a spiritual question', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({
          message: 'How can I find inner peace?',
          userId: 'test-user-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('sources');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return error for empty message', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({
          userId: 'test-user-123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/chat/history/:userId', () => {
    it('should return conversation history', async () => {
      const response = await request(app)
        .get('/api/v1/chat/history/test-user-123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('conversations');
    });
  });
});

describe('Gurbani API', () => {
  describe('GET /api/v1/gurbani/search', () => {
    it('should search Gurbani verses', async () => {
      const response = await request(app)
        .get('/api/v1/gurbani/search')
        .query({ query: 'peace', limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('query');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should return error for missing query', async () => {
      const response = await request(app)
        .get('/api/v1/gurbani/search');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/gurbani/daily', () => {
    it('should return daily verse', async () => {
      const response = await request(app)
        .get('/api/v1/gurbani/daily');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('verse');
      expect(response.body).toHaveProperty('date');
    });
  });
});

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.service).toBe('gurbani-guide-api');
  });
});
