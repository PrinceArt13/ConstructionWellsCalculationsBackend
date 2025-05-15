import request from 'supertest';
import { app } from '../../src/index';
it('/jamming-sheet - должен вернуть 200 и все расчётные значения', async () => {
    const response = await request(app)
        .post('/gnpv')
        .send({
            Depth: 2000,
            ShoeCasingDepth: 1500,
            Time: 120,
            PipePressure: 15,
            AnnularPressure: 18,
            ReleasedFluidVolume: 5,
            CasingDiameter: {
                OuterPipeDiameter: 146,
                PipeWallThickness: 10,
                ExcessReservoirPressure: 190,
                PumpSpeed: 20,
                PumpingPerTurn: 10
            },
            OpenBarrelDiameter: 190,
            SDPDiameter: {
                SDPOuterDiameter: 73,
                SDPInnerDiameter: 60
            },
            SDPLength: 1000,
            WDPDiameter: {
                WDPOuterDiameter: 89,
                WDPInnerDiameter: 75
            },
            WDPLength: 2000,
            MortarDensity: 1.2,
            HydraulicFracturingGradient: 0.018
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pipeVolume');
    expect(response.body).toHaveProperty('annularVolume');
    expect(response.body).toHaveProperty('totalVolume');
    expect(response.body).toHaveProperty('maxPressure');
    expect(response.body).toHaveProperty('reservoirPressure');
    expect(response.body).toHaveProperty('jammingMortarDensity');
    expect(response.body).toHaveProperty('totalTime');
    expect(response.body).toHaveProperty('totalNumberTurns');
    expect(response.body).toHaveProperty('pressureDrop');

    expect(response.status).toBe(200);
    expect(parseFloat(response.body.pipeVolume)).toBeCloseTo(11.7, 1);
    expect(parseFloat(response.body.annularVolume)).toBeCloseTo(44.6, 1);
    expect(parseFloat(response.body.totalVolume)).toBeCloseTo(56.3, 1);
    expect(parseFloat(response.body.maxPressure)).toBeCloseTo(7.9, 1);
    expect(parseFloat(response.body.maxMortarDensity)).toBeCloseTo(1.8, 1);
    expect(parseFloat(response.body.reservoirPressure)).toBeCloseTo(40.5, 1);
    expect(parseFloat(response.body.jammingMortarDensity)).toBeCloseTo(2.2, 1);
    expect(parseFloat(response.body.totalTime)).toBeCloseTo(46.9, 1);
    expect(parseFloat(response.body.totalNumberTurns)).toBe(5627);
    expect(parseFloat(response.body.pressureDrop)).toBeCloseTo(1.3, 1);
});