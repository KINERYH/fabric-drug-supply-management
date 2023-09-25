const drugsService = require("../services/drugs.service")

const getAllDrugs = async (req, res) => {
  try {
    const allDrugs = await drugsService.getAllDrugs();
    res.json({ status: "OK", data: allDrugs });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const getDrug = async (req, res) => {
  const drug = await drugsService.getDrug(req.params.drugId);
  res.json({ message: "Get an existing drug: " + drug });
};

const createDrug = (req, res) => {
  const createdDrug = drugsService.createDrug();
  res.json({ message: "Create a new drug" });
};

const updateDrug = (req, res) => {
  const updatedDrug = drugsService.updateDrug();
  res.json({ message: "Update an existing drug" });
};

const deleteDrug = (req, res) => {
  const deletedDrug = drugsService.deleteDrug();
  res.json({ message: "Delete an existing drug" });
};

module.exports = {
  getAllDrugs,
  getDrug,
  createDrug,
  updateDrug,
  deleteDrug
};