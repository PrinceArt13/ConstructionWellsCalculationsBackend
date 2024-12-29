import { Router } from "express";
import MortarController from "./controllers/mortarController.js";

const router = Router();

router.get("/mixing-mortars", MortarController.MixingMortars);

router.get("/changing-density-by-adding-mortar", MortarController.ChangingDensityByAddingMortar);

router.get("/water-quantity-to-decrease-mortar-density", MortarController.WaterQuantityToDecreaseMortarDensity);

router.get("/mortar-weightning", MortarController.MortarWeightning);

router.get("/well-volume", MortarController.WellVolume);

export default router;

