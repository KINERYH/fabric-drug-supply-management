const drugsService = require("../services/drugs.service");


const getAllDrugs = async (req, res) => {
  try {
    const allDrugs = await drugsService.getAllDrugs(req.currentUser);
    res.json({ status: "OK", data: allDrugs });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const getDrug = async (req, res) => {
  try{
    const drug = await drugsService.getDrug(req.params.drugId, req.currentUser);
    res.status(200).json({
      message: "Get an existing drug: ",
      data: drug
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Failed to get drug.",
      error: error?.message || error
    });
  }
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