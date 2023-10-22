'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");


const getAllBoxes = async (currentUser) => {
  const { ccp, wallet } = require("../index");
  try {
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log('\n--> Evaluate Transaction: GetAllBoxes.');
    const result = await contract.evaluateTransaction('GetAllBoxes');
    ledger.disconnect(gateway);
    const boxes = JSON.parse(result.toString());
    console.log("*** Boxes:", JSON.stringify(boxes, null, 2));
    return boxes;
  } catch (error) {
    console.error('Failed to get boxes: ' + '\n' + error?.message);
    throw error;
  }
};


const getBox = async (boxId, currentUser) => {
  try {
    const boxes = await getAllBoxes(currentUser);
    
    // filter for the specified box
    const box = boxes.find(box => box.BoxID === boxId);
    return box;
  } catch (error) {
    console.error('Failed to get box: ' + boxId + '\n' + error?.message);
    throw error;
  }
};

const createBox = () => {
  return;
};

const updateBox = () => {
  return;
};

const deleteBox = () => {
  return;
};

module.exports = {
  getAllBoxes,
  getBox,
  createBox,
  updateBox,
  deleteBox
};