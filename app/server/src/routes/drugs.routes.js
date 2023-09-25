const express = require("express");
const router = express.Router();
const drugsController = require("../controllers/drugs.controller")

router.get("/", drugsController.getAllDrugs);

router.get("/:drugId", drugsController.getDrug);

router.post("/", drugsController.createDrug);

router.patch("/:drugId", drugsController.updateDrug);

router.delete("/:drugId", drugsController.deleteDrug);

module.exports = router;