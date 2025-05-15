import request from 'supertest';
import { app } from '../../../src/index'

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