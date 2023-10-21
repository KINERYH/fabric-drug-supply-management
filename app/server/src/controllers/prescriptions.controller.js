const prescriptionsService = require("../services/prescriptions.service")
const authMiddleware = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");


const getAllPrescriptions = async (req, res) => {
  try{
    const allPrescriptions = await prescriptionsService.getAllPrescriptions(req.currentUser);
    res.status(200).json({ 
      status: "OK", 
      data: allPrescriptions 
    });
  } catch(error) {
    res.status(error?.status || 500).json({
      message: "Failed to get prescriptions.",
      error: error?.message || error
    });
  }
};

const getPrescription = async (req, res) => {
  try{
    const prescription = await prescriptionsService.getPrescription(req.params.prescriptionId, req.currentUser);
    res.status(200).json({
      message: "Get an existing prescription: ",
      data: prescription
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Failed to get prescription.",
      error: error?.message || error
    });
  }
};

const createPrescription = async (req, res) => {
  try{
    const createdPrescription = await prescriptionsService.createPrescription(req.body);
    res.status(201).json({
      message: "New prescription created.",
      data: createdPrescription
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Prescription not created.",
      error: error?.message || error
    });
  }
};

const updatePrescription = async (req, res) => {
  const updatedPrescription = prescriptionsService.updatePrescription();
  res.json({ message: "Update an existing prescription" });
};

const deletePrescription = async (req, res) => {
  const deletedPrescription = prescriptionsService.deletePrescription();
  res.json({ message: "Delete an existing prescription" });
};

module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription
};