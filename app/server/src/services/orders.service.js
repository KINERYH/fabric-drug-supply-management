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
const createOrder = async (body, currentUser) => {
  const orderId = uuidv4();
  try{
    const { ccp, wallet } = require("../index")
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log(`\n--> Evaluate Transaction: createOrder for a specific ${currentUser.role}.`);
    const result = await contract.submitTransaction('RequestOrder', currentUser.uuid, orderId, body.ManufacturerID, body.Drugs, body.Description);
    const createdOrder = JSON.parse(result.toString());
    ledger.disconnect(gateway);
    console.log("*** Created order:", JSON.stringify(createdOrder, null, 2));
    return createdOrder;
  }
  catch(error){
    console.error('Failed to create order: ' + '\n' + error?.message);
    throw error;
  }
};

const updateOrder = () => {

  return;
};

const deleteOrder = () => {
  return;
};

const processOrder = async (orderId, currentUser) => {
  console.log('*** Current user:', currentUser);
  const { ccp, wallet } = require("../index");
  const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
  try{  
    if (currentUser.role === 'Manufacturer'){
      const order = await getOrder(orderId, currentUser);
      const manufacturerID = currentUser.uuid;
      const manufacturerResult = await contract.evaluateTransaction('GetAllInfo', manufacturerID);
      const manufacturer = JSON.parse(manufacturerResult.toString());
      const boxesResult = await contract.evaluateTransaction('GetAllBoxes');
      const boxes = JSON.parse(boxesResult.toString());

      if(order.ManufacturerID !== manufacturerID){
        throw { status: 400, message: 'This order is not for this manufacturer'};
      }
      if(order.Status !== 'pending'){
        throw { status: 400, message: 'This order is not pending'};
      }

      order.Drugs.forEach( drug => {
        if(!(manufacturer.Drugs.includes(drug.DrugID))){
          throw { status: 400, message: `No drug ${drug.DrugID} in manufacturer production catalog.`};
        } else {
          //stacca i BoxIDs
          const boxIDs = []
          for (let i = 0; i < drug.Quantity; i++) {
            boxIDs.push( uuidv4() );
          }
          //aggiungi i boxIDs all'ordine
          order.Drugs.find(d => d.DrugID === drug.DrugID).BoxIDs = boxIDs

          //aggiungi i box alla lista dei boxes
          boxIDs.forEach( boxID => {
            boxes.push(
              {
                "DrugID": drug.DrugID,
                "BoxID": boxID,
                "ExpirationDate": new Date().toISOString(),
                "ProductionDate": new Date().toISOString()
              }
            )
            console.log(`***New box: ${JSON.stringify(boxes.find( b => b.BoxID === boxID))}`);
          })
        }
      })

      order.Status = "shipped";
      await contract.submitTransaction('ProcessOrder', JSON.stringify(order), JSON.stringify(boxes));
      ledger.disconnect(gateway);
      console.log("*** Updated order:", JSON.stringify(order, null, 2));
      return order;
    } else {
      console.log(`\n--> Evaluate Transaction: processOrder for orderID ${orderId}.`);
      const result = await contract.submitTransaction('ProcessOrder', orderId, currentUser.uuid);
      const updatedOrder = JSON.parse(result.toString());
      ledger.disconnect(gateway);
      console.log("*** Updated order:", JSON.stringify(updatedOrder, null, 2));
      return updatedOrder;
    }//end if
  } catch (error) {
    console.error('Failed to process order: ' + orderId + '\n' + error?.message);
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