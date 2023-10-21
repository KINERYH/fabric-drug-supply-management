'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
};

const getAllDrugs = async () => {
  // If I remove this requirement from here and put it at the beginning of the script i get an error
  const { ccp, wallet } = require("../index");
  //TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
  const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName);

  console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
  const result = await contract.evaluateTransaction('GetAllAssets');
  const data = JSON.parse(result.toString());
  const drugs = data.drugs;
  console.log("*** Drugs:", JSON.stringify(drugs, null, 2));
  return drugs;
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