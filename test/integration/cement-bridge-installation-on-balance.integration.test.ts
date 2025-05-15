import request from 'supertest';
import { app } from '../../src/index'

it('/cement-bridge-installation-on-balance - должен вернуть 200 и количество цемента, объёмы буфера и продавки', async () => {
    const response = await request(app)
        .post('/cement-bridge-installation-on-balance')
        .send({
            cementBridgeHeight: 10,
            runningVolumeCasingString: 0.6,
            excessVolume: 10,
            buffer1Volume: 5,
            runningCapacityRing: 0.05,
            runningVolumeInnerPipe: 0.4,
            drillPipeLength: 100
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('requiredCementCount');
    expect(response.body).toHaveProperty('buffer2Volume');
    expect(response.body).toHaveProperty('salesVolume');

    expect(parseFloat(response.body.requiredCementCount)).toBeCloseTo(6.6, 1);
    expect(parseFloat(response.body.buffer2Volume)).toBeCloseTo(0.09, 2);
    expect(parseFloat(response.body.salesVolume)).toBeCloseTo(36, 0);
});
