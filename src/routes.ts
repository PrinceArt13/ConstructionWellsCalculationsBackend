import { Router } from "express";
import MortarController from "./controllers/mortarController";
import GNPVController from "./controllers/GNPVController";
import cementBridgeController from "./controllers/cementBridgeController";
import dbController from "./controllers/dbController";
import frontendController from "./controllers/frontendController";

const router = Router();

router.get("/get-constants", dbController.getConstants);

router.get("/frontend-method/:methodName", frontendController.frontendMethod)

router.post("/mixing-mortars", MortarController.MixingMortars);

router.post("/changing-density-by-adding-mortar", MortarController.ChangingDensityByAddingMortar);

router.post("/water-quantity-to-decrease-mortar-density", MortarController.WaterQuantityToDecreaseMortarDensity);

router.post("/mortar-weightning", MortarController.MortarWeightning);

router.post("/well-volume", MortarController.WellVolume);

router.post("/gnpv", GNPVController.JammingSheet);

router.post("/cement-bridge-installation", cementBridgeController.cementBridgeInstallation);

router.post("/cement-bridge-installation-on-balance", cementBridgeController.cementBridgeInstallationOnBalance);

export default router;

