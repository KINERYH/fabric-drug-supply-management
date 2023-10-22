const express = require("express");
const router = express.Router();
const boxesController = require("../controllers/boxes.controller")
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.authenticateToken, boxesController.getAllBoxes);

router.get("/:boxId", authMiddleware.authenticateToken, boxesController.getBox);

router.post("/", authMiddleware.authenticateToken, boxesController.createBox);

router.patch("/:boxId", authMiddleware.authenticateToken, boxesController.updateBox);

router.delete("/:boxId", authMiddleware.authenticateToken, boxesController.deleteBox);

module.exports = router;