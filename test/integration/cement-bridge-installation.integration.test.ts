import request from 'supertest';
import { app } from '../../src/index'

it('/cement-bridge-installation - должен вернуть 200 и объём цемента, буфера и продавки', async () => {
    const response = await request(app)
        .post('/cement-bridge-installation')
        .send({
            BufferFluid: 0,
            PipeType: 0,
            CrossSectionArea: 0.5,
            RingSpaceArea: 0.8,
            InternalPassageChannelArea: 0.05,
            BridgeHeight: 10,
            InternalPipeColumnVolume: 20
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('PluggingVolume');
    expect(response.body).toHaveProperty('BufferFluidVolume1');
    expect(response.body).toHaveProperty('BufferFluidVolume2');
    expect(response.body).toHaveProperty('ChaserVolume');

    console.log(response.body);

    expect(parseFloat(response.body.PluggingVolume)).toBeCloseTo(6, 3);
    expect(parseFloat(response.body.BufferFluidVolume1)).toBeCloseTo(3.6, 3);
    expect(parseFloat(response.body.BufferFluidVolume2)).toBeCloseTo(0.4, 1);
    expect(parseFloat(response.body.ChaserVolume)).toBeCloseTo(18.9, 3);
});

