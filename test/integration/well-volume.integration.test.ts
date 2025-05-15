import request from 'supertest';
import { app } from '../../src/index'
it('/well-volume - должен вернуть 200 и вместимость секции', async () => {
    const response = await request(app)
        .post('/well-volume')
        .send({
            _ID: 120,
            _Lsec: 1000
        });

    expect(response.status).toBe(200);
    expect(response.body.capacity).toBeDefined();
    expect(response.body).toHaveProperty('volumeSec');

    expect(parseFloat(response.body.volumeSec)).toBeCloseTo(11304, 3);
});