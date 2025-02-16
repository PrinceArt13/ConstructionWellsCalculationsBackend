import { Router } from "express";
import MortarController from "./controllers/mortarController.js";
import GNPVController from "./controllers/GNPVController.js";

const router = Router();

router.post("/mixing-mortars", MortarController.MixingMortars);

router.post("/changing-density-by-adding-mortar", MortarController.ChangingDensityByAddingMortar);

router.post("/water-quantity-to-decrease-mortar-density", MortarController.WaterQuantityToDecreaseMortarDensity);

router.post("/mortar-weightning", MortarController.MortarWeightning);

router.post("/well-volume", MortarController.WellVolume);

router.post("/gnpv", GNPVController.JammingSheet);

export default router;

