const express = require("express");
const router = express.Router();
const drugsController = require("../controllers/drugs.controller")
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.authenticateToken, drugsController.getAllDrugs);

router.get("/:drugId", authMiddleware.authenticateToken, drugsController.getDrug);

router.post("/", authMiddleware.authenticateToken, drugsController.createDrug);

router.patch("/:drugId", authMiddleware.authenticateToken, drugsController.updateDrug);

router.delete("/:drugId", authMiddleware.authenticateToken, drugsController.deleteDrug);

module.exports = router;