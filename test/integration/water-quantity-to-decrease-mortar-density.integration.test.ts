import request from 'supertest';
import { app } from '../../src/index'
it('/water-quantity-to-decrease-mortar-density - должен вернуть 200 и объём воды', async () => {
    const response = await request(app)
        .post('/water-quantity-to-decrease-mortar-density')
        .send({
            requiredDensity: 1.1,
            wellMortarVolume: 10,
            mortarDensity: 1.3
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('waterVolume');
    expect(response.body).toHaveProperty('finalMortarVolume');

    expect(parseFloat(response.body.waterVolume)).toBeCloseTo(20, 3);
    expect(parseFloat(response.body.finalMortarVolume)).toBeCloseTo(30, 3);
});