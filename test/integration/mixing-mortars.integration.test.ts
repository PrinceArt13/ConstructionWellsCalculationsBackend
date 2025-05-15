import request from 'supertest';
import { app } from '../../src/index'

it('/mixing-mortars - должен вернуть 200 и ожидаемые значения', async () => {
    const response = await request(app)
        .post('/mixing-mortars')
        .send({
            requiredDensity: 1.5,
            mortarVolume: 10,
            mortarDensity: 1.2,
            mortarToAddedDensity: 1.8
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mortarToAdd');
    expect(response.body).toHaveProperty('finalMortarVolume');

    expect(parseFloat(response.body.mortarToAdd)).toBeCloseTo(10, 3);
    expect(parseFloat(response.body.finalMortarVolume)).toBeCloseTo(20, 3);
});