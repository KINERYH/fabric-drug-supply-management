const express = require("express");
const router = express.Router();
const drugsController = require("../controllers/drugs.controller")

router.get("/", drugsController.getAllDrugs);

router.get("/:drugId", drugsController.getOneDrug);

router.post("/", drugsController.createNewDrug);

router.patch("/:drugId", drugsController.updateOneDrug);

router.delete("/:drugId", drugsController.deleteOneDrug);

module.exports = router;