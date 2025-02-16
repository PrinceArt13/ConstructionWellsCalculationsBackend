import { Request, Response } from 'express'

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
                PipeWallThickness // Толщина стенки трубы (мм)
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
            HydraulicFracturingGradient //Градиент гидроразрыва (МПа/м)
        } = req.body;

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
        const ro = 1.3
        const g = 0.00981

        const MaxPressure = HydraulicFracturingGradient * ShoeCasingDepth - ro * g * ShoeCasingDepth;

        // ??? почему 1,3 и 0.00981 где их брать
        // ??? нужно ли проверять входит ли число в диапазон? а если не входит?

        const MaxMortarDensity = HydraulicFracturingGradient / g

        // 3. Пластовое давление
        const ReservoirPressure = ro * g * Depth + PipePressure;

        // 4. Плотность раствора

        // ??? в расчёте сказано про превыение пластового давления, какое условие тут проверять? поставил 1.07, как-будто среднее между 10 и 5 %

        const JammingMortarDensity = (ReservoirPressure + MortarDensity * 1.07) / (g * Depth);

        // 5. Расчёт времени

        // ??? подача насоса откуда брать? 11,9 л/c
        const PumpSpeed = 11.9

        const PipeTime = (PipeVolume * 1000) / (PumpSpeed * 60);
        const AnnularTime = (AnnularVolume * 1000) / (PumpSpeed * 60);
        const TotalTime = PipeTime + AnnularTime;

        // 6. Число ходов бурового насоса

        // ??? прокачивание 15,9л за один ход, почему столько?

        const PumpingPerTurn = 15.9

        const NumberTurnsPipe = (PipeVolume * 1000) / PumpingPerTurn;
        const NumberTurnsAnnular = (AnnularVolume * 1000) / PumpingPerTurn;
        const TotalNumberTurns = NumberTurnsAnnular + NumberTurnsPipe;

        // 7. Падение давления на каждые 100 ходов

        // ??? не понимаю почему график строится не при любых случаях
        // ??? как понять что конечное а что начально, почему просто нельзя взять наименьшее P?


        const PressureDrop = (((AnnularPressure + PipePressure) - AnnularPressure) * 100) / NumberTurnsPipe;

        res.status(200).json({
            pipeVolume: PipeVolume.toFixed(3), // Объём трубного пространства (м^3)
            annularVolume: AnnularVolume.toFixed(3), // Объём затрубного пространства (м^3)
            totalVolume: TotalVolume.toFixed(3), // Общий объём скважины (м^3)
            maxPressure: MaxPressure.toFixed(3), // Максимальное давление в затрубном пространстве (МПа)
            maxMortarDensity: MaxMortarDensity.toFixed(3), // Максимальная плотность раствора (г/см^3)
            reservoirPressure: ReservoirPressure.toFixed(3), // Пластовое давление (МПа)
            jammingMortarDensity: JammingMortarDensity.toFixed(3), // Плотность раствора для глушения (г/см^3)
            totalTime: TotalTime.toFixed(2), // Общее время заполнения (мин)
            totalNumberTurns: TotalNumberTurns.toFixed(0), // Общее число ходов насоса
            pressureDrop: PressureDrop.toFixed(3) // Падение давления на каждые 100 ходов (МПа)
        });
    }

}

export default new GNPVController();