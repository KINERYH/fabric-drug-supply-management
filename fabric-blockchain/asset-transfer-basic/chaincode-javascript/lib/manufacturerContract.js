'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const { v4: uuidv4 } = require('uuid');

class ManufacturerContract extends Contract{

  async GetOrder(ctx, orderId){
    const serializedOrders = await ctx.stub.getState('orders');
    if (!serializedOrders || serializedOrders.length === 0){
      throw new Error('There are no orders in the ledger');
    }
    const orders = JSON.parse(serializedOrders.toString());
    const order = orders.find(o => o.ID === orderId);
    return order;}

  async GetAllOrders(ctx, manufacturerId){
    const serializedOrders = await ctx.stub.getState('orders');
    if (!serializedOrders || serializedOrders.length === 0){
      throw new Error('There are no orders in the ledger');
    }
    const orders = JSON.parse(serializedOrders.toString());
    const manufacturerOrders = orders.filter(o => o.ManufacturerID === manufacturerId);
    return manufacturerOrders;
  }

  async GetName(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturer');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer.Name
  }

  async GetManufacturer(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturer');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer
  }

  async GetAddress(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturer');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer.Address
  }

  async ValidateOrder(ctx, orderId, maufacturerId, boxUUIDs){
    const serializedOrders = await ctx.stub.getState('orders');
    if (!serializedOrders || serializedOrders.length === 0){
      throw new Error('There are no orders in the ledger');
    }
    let orders = JSON.parse(serializedOrders.toString());
    let order = orders.find(o => o.ID === orderId);
    console.log(`***Order: ${typeof(order)}`);
    if(order.ManufacturerID !== maufacturerId){
      throw new Error('This order is not for this manufacturer');
    }

    if(order.Status !== 'pending'){
      throw new Error('This order is not pending');
    }
    let quantity = 0;
    const drugs = order.Drugs;
    console.log(`***Drugs: ${typeof(drugs)}`);
    for (let i=0; i<drugs.length; i++){
      quantity += drugs[i].Quantity;
    }
    console.log(`***Quantity: ${quantity}`)
    const boxIDs = JSON.parse(boxUUIDs);
    if (boxIDs.length !== quantity){
      console.log(`***DrugIDs: ${(boxIDs)}`);
      console.log(`***Quantity: ${quantity}`);
      throw new Error('The number of drugs is not correct');
    }
    console.log(`Drug ids: ${boxIDs}`);
    orders.find(o => o.ID === orderId).Status = 'shipped';
    orders.find(o => o.ID === orderId).DrugID = boxIDs;
    console.log("***Orders: ")
    console.log(orders);
    await ctx.stub.putState('orders', Buffer.from(stringify(sortKeysRecursive(orders))));
    console.log('*** Orders committed');

    const serLedgerOrders = await ctx.stub.getState('orders');
    console.log(`***Ledger: ${serLedgerOrders.toString()}`);

    const serializedDrugs = await ctx.stub.getState('drugs');
    if (!serializedDrugs || serializedDrugs.length === 0){
      throw new Error('There are no drugs in the ledger');
    }
    let drugsCodes = [];
    for (let i=0; i<drugs.length; i++){
      drugsCodes.push(drugs[i].DrugID);
    }
    let drugsList = JSON.parse(serializedDrugs.toString());
    console.log(`***Drugs: ${stringify(drugsList)}`);
    const producedDrugs = this.GetManufacturer(ctx, maufacturerId).Drugs;

    const date = new Date();
    const prodDate = date.toISOString().slice(0,10);
    console.log(`***ProdDate: ${prodDate}`)
    date.setFullYear(date.getFullYear() + 1);
    const expDate = date.toISOString().slice(0,10);


    for (let i=0; i<drugsCodes.length; i++){
      let drugName = producedDrugs.find(d => d.DrugID === drugsCodes[i]).Name;
      drugsList.push({BoxID: boxIDs[i], DrugID: drugsCodes[i], Name:drugName, ProductionDate: prodDate, ExpirationDate: expDate});
    }
    console.log(`***Drugs: ${drugsList}`);

    await ctx.stub.putState('drugs', Buffer.from(stringify(sortKeysRecursive(drugsList))));

    console.log('*** Result: committed');

    return order;


  }

}
module.exports = ManufacturerContract;