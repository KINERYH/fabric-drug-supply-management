const drugsService = require("../services/drugs.service")


const getAllDrugs = (req, res) => {
  const allDrugs = drugsService.getAllDrugs();
  res.json({ status: "OK", data: allDrugs });
};

const getOneDrug = (req, res) => {
  const drug = drugsService.getOneDrug();
  res.json({ message: "Get an existing drug: " + req.params.drugId });
};

const createNewDrug = (req, res) => {
  const createdDrug = drugsService.createNewDrug();
  res.json({ message: "Create a new drug" });
};

const updateOneDrug = (req, res) => {
  const updatedDrug = drugsService.updateOneDrug();
  res.json({ message: "Update an existing drug" });
};

const deleteOneDrug = (req, res) => {
  const deletedDrug = drugsService.deleteOneDrug();
  res.json({ message: "Delete an existing drug" });
};

module.exports = {
  getAllDrugs,
  getOneDrug,
  createNewDrug,
  updateOneDrug,
  deleteOneDrug
};