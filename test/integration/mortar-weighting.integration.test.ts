import request from 'supertest';
import { app } from '../../src/index'
it('/mortar-weightning - должен вернуть 200 и массу утяжелителя', async () => {
    const response = await request(app)
        .post('/mortar-weightning')
        .send({
            _requiredDensity: 1.8,
            _mortarVolume: 10,
            _mortarDensity: 1.2,
            _weightingAgentSpecificGravity: 4.5
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('weightingAgentWeight');
    expect(response.body).toHaveProperty('finalMortarVolume');

    expect(parseFloat(response.body.weightingAgentWeight)).toBeCloseTo(10000, 3);
    expect(parseFloat(response.body.finalMortarVolume)).toBeCloseTo(12.2, 1);
});
