const express = require("express");
const router = express.Router();
const prescriptionsController = require("../controllers/prescriptions.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/", authMiddleware.authenticateToken, prescriptionsController.getAllPrescriptions);

router.get("/:prescriptionId", authMiddleware.authenticateToken, prescriptionsController.getPrescription);

router.post("/", authMiddleware.authenticateToken, prescriptionsController.createPrescription);

router.patch("/:prescriptionId", authMiddleware.authenticateToken, prescriptionsController.processPrescription);

router.delete("/:prescriptionId", authMiddleware.authenticateToken, prescriptionsController.deletePrescription);

module.exports = router;