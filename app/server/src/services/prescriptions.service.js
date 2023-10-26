'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");
const { v4: uuidv4 } = require('uuid');


const getAllPrescriptions = async (currentUser) => {
  const { ccp, wallet } = require("../index");
  try {
    //TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log(`\n--> Evaluate Transaction: GetAllPrescriptions for a specific ${currentUser.role}.`);
    const result = await contract.evaluateTransaction('GetAllPrescriptions', currentUser.uuid);
    ledger.disconnect(gateway);
    const prescriptions = JSON.parse(result.toString());
    console.log("*** Prescriptions:", JSON.stringify(prescriptions, null, 2));
    return prescriptions;
  } catch (error) {
    console.error('Failed to get prescriptions: ' + '\n' + error?.message);
    throw error;
  }
};


const getPrescription = async (prescriptionId, currentUser) => {
  try {
    const prescriptions = await getAllPrescriptions(currentUser);
    
    // filter for the specified prescription
    const prescription = prescriptions.find(prescription => prescription.ID === prescriptionId);
    return prescription;
  } catch (error) {
    console.error('Failed to get prescription: ' + prescriptionId + '\n' + error?.message);
    throw error;
  }
};


const createPrescription = async (body, currentUser) => {
  const prescriptionID = uuidv4();
  try{
    const { ccp, wallet } = require("../index");
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    const prescription = await contract.submitTransaction('CreatePrescription', currentUser.uuid, body.PatientCF, prescriptionID, body.DrugsList, body.Description);
    ledger.disconnect(gateway);
    return prescription;
  } catch (error) {
    console.error('Failed to create prescription: ' + '\n' + error?.message);
    throw error;
  }
};

const updatePrescription = () => {
  return;
};

const deletePrescription = () => {
  return;
};

const processPrescription = async (prescriptionID, currentUser) => {
  try{
    const { ccp, wallet } = require("../index");
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    const updatedPrescription = await contract.submitTransaction('ProcessPrescription', prescriptionID, currentUser.uuid, new Date().toISOString());
    ledger.disconnect(gateway);
    return updatedPrescription;
  } catch (error) {
    console.error('Failed to process prescription: ' + prescriptionID + '\n' + error?.message);
    throw error;
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
  processPrescription
};