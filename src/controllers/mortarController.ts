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

        res.status(200).json({
            mortarToAdd: mortarToAdd.toFixed(3),
            finalMortarVolume: finalMortarVolume.toFixed(3)
        });
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

        res.status(200).json({
            finalMortarDensity: finalMortarDensity.toFixed(3),
            finalMortarVolume: finalMortarVolume.toFixed(3)
        });
    }

    async WaterQuantityToDecreaseMortarDensity(req: Request, res: Response): Promise<void> {
        const {
            requiredDensity,
            wellMortarVolume,
            mortarDensity
        } = req.body;

        const waterVolume = (wellMortarVolume * (mortarDensity - requiredDensity)) / (requiredDensity - 1);
        const finalMortarVolume = waterVolume + wellMortarVolume;

        res.status(200).json({
            waterVolume: waterVolume.toFixed(3),
            finalMortarVolume: finalMortarVolume.toFixed(3)
        });
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

        res.status(200).json({
            weightingAgentWeight: weightingAgentWeight.toFixed(3),
            finalMortarVolume: finalMortarVolume.toFixed(3)
        });
    }

    async WellVolume(req: Request, res: Response): Promise<void> {
        let { OD, ID, Lsec } = req.body;

        if (OD == null) {
            OD = 0;
        }

        const liters = 0.785 * (ID ** 2 - OD ** 2) / 10 ** 3;
        const meters = 0.785 * (ID ** 2 - OD ** 2) / 10 ** 6;
        const volumeSec = 0.785 * ID ** 2 * Lsec / 10 ** 3;

        res.status(200).json({
            capacity: {
                liters: liters,
                meters: meters
            },
            volumeSec: volumeSec
        });
    }
}

export default new MortarController();
