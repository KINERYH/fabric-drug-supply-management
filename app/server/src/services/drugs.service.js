'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
};

const getAllDrugs = async () => {
  // Let's try a query type operation (function).
  // This will be sent to just one peer and the results will be shown.
  console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
  const result = await contract.evaluateTransaction('GetAllAssets');
  console.log(`*** Result: ${prettyJSONString(result.toString())}`);
  return;
};

const getDrug = async (drugId) => {
  const { ccp, wallet } = require("../index");

  const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName);
  console.log(contract);
  console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
  const result = await contract.evaluateTransaction('ReadAsset', 'assets');
  console.log(`*** Result: ${prettyJSONString(result.toString())}`);

  return;
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