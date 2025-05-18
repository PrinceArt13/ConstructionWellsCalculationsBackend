import { Request, Response } from "express";

class MortarController {
    async MixingMortars(req: Request, res: Response): Promise<void> {

        const {
            requiredDensity,
            mortarVolume,
            mortarDensity,
            mortarToAddedDensity
        } = req.body;

        const mortarToAdd = mortarVolume * (mortarDensity - requiredDensity) / (requiredDensity - mortarToAddedDensity);
        const finalMortarVolume = mortarToAdd + mortarVolume;

        if (!isFinite(mortarToAdd) || isNaN(mortarToAdd) || mortarToAdd < 0
            ||
            !isFinite(finalMortarVolume) || isNaN(finalMortarVolume) || finalMortarVolume < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    mortarToAdd: mortarToAdd,
                    finalMortarVolume: finalMortarVolume
                }
            });
            return;
        }

        res.status(200).json({
            mortarToAdd: Number(mortarToAdd.toFixed(3)),
            finalMortarVolume: Number(finalMortarVolume.toFixed(3))
        });
        return;
    }

    async ChangingDensityByAddingMortar(req: Request, res: Response): Promise<void> {
        const {
            densityChange,
            mortarToAddedDensity,
            mortarVolume,
            mortarDensity
        } = req.body;

        const finalMortarVolume = densityChange + mortarVolume;
        const finalMortarDensity = (mortarVolume * mortarDensity + densityChange * mortarToAddedDensity) / finalMortarVolume;

        if (!isFinite(finalMortarDensity) || isNaN(finalMortarDensity) || finalMortarDensity < 0
            ||
            !isFinite(finalMortarVolume) || isNaN(finalMortarVolume) || finalMortarVolume < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    finalMortarDensity: finalMortarDensity,
                    finalMortarVolume: finalMortarVolume
                }
            });
            return;
        }

        res.status(200).json({
            finalMortarDensity: Number(finalMortarDensity.toFixed(3)),
            finalMortarVolume: Number(finalMortarVolume.toFixed(3))
        });
        return;
    }

    async WaterQuantityToDecreaseMortarDensity(req: Request, res: Response): Promise<void> {
        const {
            requiredDensity,
            wellMortarVolume,
            mortarDensity
        } = req.body;

        const waterVolume = (wellMortarVolume * (mortarDensity - requiredDensity)) / (requiredDensity - 1);
        const finalMortarVolume = waterVolume + wellMortarVolume;

        if (!isFinite(waterVolume) || isNaN(waterVolume) || waterVolume < 0
            ||
            !isFinite(finalMortarVolume) || isNaN(finalMortarVolume) || finalMortarVolume < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    waterVolume: waterVolume,
                    finalMortarVolume: finalMortarVolume
                }
            });
            return;
        }

        res.status(200).json({
            waterVolume: Number(waterVolume.toFixed(3)),
            finalMortarVolume: Number(finalMortarVolume.toFixed(3))
        });
        return;
    }

    async MortarWeightning(req: Request, res: Response): Promise<void> {
        const {
            _requiredDensity,
            _mortarVolume,
            _mortarDensity,
            _weightingAgentSpecificGravity
        } = req.body;

        const requiredDensity = parseFloat(_requiredDensity as string);
        const mortarVolume = parseFloat(_mortarVolume as string);
        const mortarDensity = parseFloat(_mortarDensity as string);
        const weightingAgentSpecificGravity = parseFloat(_weightingAgentSpecificGravity as string);

        const weightingAgentWeight = (weightingAgentSpecificGravity * 1000 * (requiredDensity - mortarDensity) * mortarVolume) / (weightingAgentSpecificGravity - requiredDensity);
        const finalMortarVolume = weightingAgentWeight / (weightingAgentSpecificGravity * 1000) + mortarVolume;

        if (!isFinite(weightingAgentWeight) || isNaN(weightingAgentWeight) || weightingAgentWeight < 0
            ||
            !isFinite(finalMortarVolume) || isNaN(finalMortarVolume) || finalMortarVolume < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    weightingAgentWeight: weightingAgentWeight,
                    finalMortarVolume: finalMortarVolume
                }
            });
            return;
        }

        res.status(200).json({
            weightingAgentWeight: Number(weightingAgentWeight.toFixed(3)),
            finalMortarVolume: Number(finalMortarVolume.toFixed(3))
        });
        return;
    }

    async WellVolume(req: Request, res: Response): Promise<void> {
        let { _OD, _ID, _Lsec } = req.body;

        if (_OD == null) {
            _OD = 0;
        }

        const liters = 0.785 * (_ID ** 2 - _OD ** 2) / 10 ** 3;
        const meters = 0.785 * (_ID ** 2 - _OD ** 2) / 10 ** 6;
        const volumeSec = 0.785 * _ID ** 2 * _Lsec / 10 ** 3;

        if (!isFinite(liters) || isNaN(liters) || liters < 0
            ||
            !isFinite(meters) || isNaN(meters) || meters < 0
            ||
            !isFinite(volumeSec) || isNaN(volumeSec) || volumeSec < 0) {
            res.status(400).json({
                error: 'Некорректный результат расчёта',
                details: {
                    capacity: {
                        liters: Number(liters),
                        meters: Number(meters)
                    },
                    volumeSec: Number(volumeSec)
                }
            });
            return;
        }

        res.status(200).json({
            capacity: {
                liters: Number(liters),
                meters: Number(meters)
            },
            volumeSec: Number(volumeSec)
        });
        return;
    }
}

export default new MortarController();
