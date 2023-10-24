'use strict';

const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");
const { v4: uuidv4 } = require('uuid');


const getAllOrders = async (currentUser) => {
  const { ccp, wallet } = require("../index");
  try {
    //TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log(`\n--> Evaluate Transaction: getAllOrders for a specific ${currentUser.role}.`);
    const result = await contract.evaluateTransaction('GetAllOrders', currentUser.uuid);
    ledger.disconnect(gateway);
    const orders = JSON.parse(result.toString());
    console.log("*** Orders:", JSON.stringify(orders, null, 2));
    return orders;
  } catch (error) {
    console.error('Failed to get orders: ' + '\n' + error?.message);
    throw error;
  }
};


const getOrder = async (orderId, currentUser) => {
  try {
    const orders = await getAllOrders(currentUser);

    // filter for the specified prescription
    const order = orders.find(order => order.ID === orderId);
    return order;
  } catch (error) {
    console.error('Failed to get order: ' + orderId + '\n' + error?.message);
    throw error;
  }
};

// TODO: implementare
const createOrder = () => {
  return;
};

const updateOrder = () => {
  return;
};

const deleteOrder = () => {
  return;
};

const processOrder = async (orderId, currentUser) => {
  // Check if the prescription exists
  // const prescription = await getPrescription(prescriptionID, currentUser);
  // if (!prescription) {
  //   throw { status: 404, message: "Prescription with id " + prescriptionId + " does not exist."};
  // }

  //TODO: far mostrare un messaggio di errore se:
  // - la prescrizione non esiste
  // - la prescrizione è già stata processata
  // - mancano dei farmaci nella farmacia per poter soddisfare la prescrizione
  try{
    const { ccp, wallet } = require("../index");
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    const updatedPrescription = await contract.submitTransaction('ProcessOrder', orderId, currentUser.uuid);
    ledger.disconnect(gateway);
    return updatedPrescription;
  } catch (error) {
    console.error('Failed to process prescription: ' + prescriptionID + '\n' + error?.message);
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  processOrder
};