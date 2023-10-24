'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");



function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
};

const getAllDrugs = async (currentUser) => {
  const { ccp, wallet } = require("../index");
  try{
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    const result = await contract.evaluateTransaction('GetAllDrugs')
    ledger.disconnect(gateway);
    const drugs = JSON.parse(result.toString());
    return drugs;
  } catch (error) {
    console.error('Failed to get drugs: ' + '\n' + error?.message);
    throw error;
  }
};


const getDrug = async (drugId, currentUser) => {
  const { ccp, wallet } = require("../index");
  try {
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log('\n--> Evaluate Transaction: GetDrug for a specific drugID.');
    const result = await contract.evaluateTransaction('GetDrug', drugId);
    ledger.disconnect(gateway);
    const drug = JSON.parse(result.toString());
    console.log("*** Drug:", JSON.stringify(drug, null, 2));
    return drug;
  } catch (error) {
    console.error('Failed to get drug: ' + drugId + '\n' + error?.message);
    throw error;
  }
};

const createDrug = () => {
  return;
};

const updateDrug = () => {
  return;
};

const deleteDrug = () => {
  return;
};

module.exports = {
  getAllDrugs,
  getDrug,
  createDrug,
  updateDrug,
  deleteDrug
};