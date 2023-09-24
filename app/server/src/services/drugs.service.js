'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");
const jsonpath = require('jsonpath');

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

  //TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
  const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName);
  
  console.log(`\n--> Evaluate Transaction: ReadAsset, function returns assets or participants list`);
  let assets = await contract.evaluateTransaction('ReadAsset', 'assets');
  console.log(`*** Result: ${prettyJSONString(assets.toString())}`);
  assets = JSON.parse(assets.toString());
  const drug = jsonpath.query(assets, `$.drugs[?(@.ID == '${drugId}')]`);
  console.log(drug);
  return drug.toString();
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