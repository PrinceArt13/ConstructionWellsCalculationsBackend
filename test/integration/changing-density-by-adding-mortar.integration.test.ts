import request from 'supertest';
import { app } from '../../src/index'
it('/changing-density-by-adding-mortar - должен вернуть 200 и корректные значения', async () => {
    const response = await request(app)
        .post('/changing-density-by-adding-mortar')
        .send({
            densityChange: 0.3,
            mortarToAddedDensity: 1.8,
            mortarVolume: 10,
            mortarDensity: 1.2
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('finalMortarVolume');
    expect(response.body).toHaveProperty('finalMortarDensity');

    expect(parseFloat(response.body.finalMortarVolume)).toBeCloseTo(10.3, 1);
    expect(parseFloat(response.body.finalMortarDensity)).toBeCloseTo(1.2, 1);
});