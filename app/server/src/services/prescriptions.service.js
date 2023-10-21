'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");


const getAllPrescriptions = async (currentUser) => {
  const { ccp, wallet } = require("../index");
  try {
    //TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log('\n--> Evaluate Transaction: GetAllPrescriptions for a specific patient.');
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

const createPrescription = () => {
  return;
};

const updatePrescription = () => {
  return;
};

const deletePrescription = () => {
  return;
};

module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription
};