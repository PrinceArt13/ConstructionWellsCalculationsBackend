import { Request, Response } from 'express'
import { db, closeDatabaseConnection } from '../db/dbKysely';
import { Constants } from '../db/schema';

// ГНПВ - газонефтеводопроявление
class GNPVController {
    //Лист глушения при ГНПВ
    async JammingSheet(req: Request, res: Response): Promise<void> {
        const {
            Depth, //Глубина бурения (м)
            ShoeCasingDepth, //Глубина башмака последней обсадной колонны (м)
            Time, //Время после закрытия превентора (с)
            PipePressure, //Давление в трубе (МПа)
            AnnularPressure, //Затрубное давление (МПа)
            ReleasedFluidVolume, //Объём вышедшего флюида (м^3)
            CasingDiameter: {
                OuterPipeDiameter, // Внутренний диаметр трубы (мм)
                PipeWallThickness, // Толщина стенки трубы (мм)
                ExcessReservoirPressure, // Превышение пластового давления (%)
                PumpSpeed, // Подача насоса (л/с)
                PumpingPerTurn // (л/ход)
            }, //Диаметр обсадной колонны (мм)
            OpenBarrelDiameter, //Диаметр открытого ствола (мм)
            //Стальная Бурильная Труба - универсальная труба для бурения\\
            SDPDiameter: {
                SDPOuterDiameter, //внешний диаметр (мм)
                SDPInnerDiameter // внутренний диаметр (мм)
            }, //Диаметр СБТ (мм)
            SDPLength, //Длина СБТ (м)
            //Утяжелённая Бурильная Труба - предназначены для повышения..
            //..жёсткости и увеличеняия массы нижней части бурильной колонны, посредством которой создаётся нагрузка на долото\\
            WDPDiameter: {
                WDPOuterDiameter, // внешний диаметр (мм)
                WDPInnerDiameter // внутренний диаметр (мм)
            }, //Диаметр УДП (мм)
            WDPLength, //Длина УДП (м)
            MortarDensity, //Плотность раствора (г/см^3)
            HydraulicFracturingGradient, //Градиент гидроразрыва (МПа/м)
        } = req.body;

        const constants = await db.selectFrom('constants').selectAll().execute();

        const SDPOD = SDPOuterDiameter / 1000;
        const SDPID = SDPInnerDiameter / 1000;
        const WDPOD = WDPOuterDiameter / 1000;
        const WDPID = WDPInnerDiameter / 1000;
        const InnerCasingDiameter = (OuterPipeDiameter - 2 * PipeWallThickness) / 1000;

        // 1. Объём скважины

        // 1.1 Объём трубного пространства
        const SDPVolume = (Math.PI * SDPID ** 2) / 4 * SDPLength;
        const WDPVolume = (Math.PI * WDPID ** 2) / 4 * WDPLength;

        const PipeVolume = SDPVolume + WDPVolume;

        // 1.2 Объём затрубного пространства
        const SDPVolumeCasing = (Math.PI * (InnerCasingDiameter ** 2 - SDPOD ** 2)) / 4 * ShoeCasingDepth;
        const SDPVolumeOpenBarrel = (Math.PI * ((OpenBarrelDiameter / 1000) ** 2 - SDPOD ** 2)) / 4 * (SDPLength - ShoeCasingDepth);
        const WDPVolumeOpenBarrel = (Math.PI * ((OpenBarrelDiameter / 1000) ** 2 - WDPOD ** 2)) / 4 * WDPLength;

        const AnnularVolume = SDPVolumeCasing + SDPVolumeOpenBarrel + WDPVolumeOpenBarrel;

        // 1.3 Общий объём скважины
        const TotalVolume = PipeVolume + AnnularVolume;

        // 2. Максимальное давление в затрубном пространстве 
        // (не должна превышать разницу между максимальным давлением гидроразрыва пород и давлением столба жидкости бурового раствора под башмаком последней обсадной колонны)
        // ... и максимальная допустимая плотность бурового раствора
        const ro = parseFloat(constants.find((x) => x.name === 'ro')?.value);
        const g = parseFloat(constants.find((x) => x.name === 'g')?.value); //ускорение свободного падения

        const MaxPressure = HydraulicFracturingGradient * ShoeCasingDepth - ro * g * ShoeCasingDepth;

        const MaxMortarDensity = HydraulicFracturingGradient / g

        // 3. Пластовое давление
        const ReservoirPressure = ro * g * Depth + PipePressure;

        // 4. Плотность раствора

        const JammingMortarDensity = (ReservoirPressure + MortarDensity * (1 + ExcessReservoirPressure / 100)) / (g * Depth);

        // 5. Расчёт времени

        const PipeTime = (PipeVolume * 1000) / (PumpSpeed * 60);
        const AnnularTime = (AnnularVolume * 1000) / (PumpSpeed * 60);
        const TotalTime = PipeTime + AnnularTime;

        // 6. Число ходов бурового насоса

        const NumberTurnsPipe = (PipeVolume * 1000) / PumpingPerTurn;
        const NumberTurnsAnnular = (AnnularVolume * 1000) / PumpingPerTurn;
        const TotalNumberTurns = NumberTurnsAnnular + NumberTurnsPipe;

        // 7. Падение давления на каждые 100 ходов

        const PressureDrop = (((AnnularPressure + PipePressure) - AnnularPressure) * 100) / NumberTurnsPipe;

        if (!isFinite(PipeVolume) || isNaN(PipeVolume) || PipeVolume < 0
            ||
            !isFinite(AnnularVolume) || isNaN(AnnularVolume) || AnnularVolume < 0
            ||
            !isFinite(TotalVolume) || isNaN(TotalVolume) || TotalVolume < 0
            ||
            !isFinite(MaxPressure) || isNaN(MaxPressure) || MaxPressure < 0
            ||
            !isFinite(MaxMortarDensity) || isNaN(MaxMortarDensity) || MaxMortarDensity < 0
            ||
            !isFinite(ReservoirPressure) || isNaN(ReservoirPressure) || ReservoirPressure < 0
            ||
            !isFinite(JammingMortarDensity) || isNaN(JammingMortarDensity) || JammingMortarDensity < 0
            ||
            !isFinite(TotalTime) || isNaN(TotalTime) || TotalTime < 0
            ||
            !isFinite(TotalNumberTurns) || isNaN(TotalNumberTurns) || TotalNumberTurns < 0
            ||
            !isFinite(PressureDrop) || isNaN(PressureDrop) || PressureDrop < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    pipeVolume: PipeVolume, // Объём трубного пространства (м^3)
                    annularVolume: AnnularVolume, // Объём затрубного пространства (м^3)
                    totalVolume: TotalVolume, // Общий объём скважины (м^3)
                    maxPressure: MaxPressure, // Максимальное давление в затрубном пространстве (МПа)
                    maxMortarDensity: MaxMortarDensity,// Максимальная плотность раствора (г/см^3)
                    reservoirPressure: ReservoirPressure, // Пластовое давление (МПа)
                    jammingMortarDensity: JammingMortarDensity, // Плотность раствора для глушения (г/см^3)
                    totalTime: TotalTime, // Общее время заполнения (мин)
                    totalNumberTurns: TotalNumberTurns, // Общее число ходов насоса
                    pressureDrop: PressureDrop // Падение давления на каждые 100 ходов (МПа)
                }
            });
            return;
        }

        res.status(200).json({
            pipeVolume: Number(PipeVolume.toFixed(3)), // Объём трубного пространства (м^3)
            annularVolume: Number(AnnularVolume.toFixed(3)), // Объём затрубного пространства (м^3)
            totalVolume: Number(TotalVolume.toFixed(3)), // Общий объём скважины (м^3)
            maxPressure: Number(MaxPressure.toFixed(3)), // Максимальное давление в затрубном пространстве (МПа)
            maxMortarDensity: Number(MaxMortarDensity.toFixed(3)), // Максимальная плотность раствора (г/см^3)
            reservoirPressure: Number(ReservoirPressure.toFixed(3)), // Пластовое давление (МПа)
            jammingMortarDensity: Number(JammingMortarDensity.toFixed(3)), // Плотность раствора для глушения (г/см^3)
            totalTime: Number(TotalTime.toFixed(2)), // Общее время заполнения (мин)
            totalNumberTurns: Number(TotalNumberTurns.toFixed(0)), // Общее число ходов насоса
            pressureDrop: Number(PressureDrop.toFixed(3)) // Падение давления на каждые 100 ходов (МПа)
        });
        return;
    }
}

export default new GNPVController();