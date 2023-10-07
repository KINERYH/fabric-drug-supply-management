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


    let drugsCodes = [];
    let quantity = 0;
    const drugs = order.Drugs;
    console.log(`***Drugs: ${typeof(drugs)}`);
    for (let i=0; i<drugs.length; i++){
      quantity += drugs[i].Quantity;
      for (let j=0; j<drugs[i].Quantity; j++){
        drugsCodes.push(drugs[i].DrugID);
      }
    }
    console.log(`***Quantity: ${quantity}`)
    const boxIDs = JSON.parse(boxUUIDs);
    if (boxIDs.length !== quantity){
      console.log(`***DrugIDs: ${(boxIDs)}`);
      console.log(`***Quantity: ${quantity}`);
      throw new Error('The number of drugs is not correct');
    }

    console.log(`Box ids: ${boxIDs}`);
    orders.find(o => o.ID === orderId).Status = 'shipped';
    //orders.find(o => o.ID === orderId).BoxIDs = boxIDs;
    let orderDrugs = orders.find(o => o.ID === orderId).Drugs;
    console.log("***Orders: ")
    console.log(orders);


    const serLedgerOrders = await ctx.stub.getState('orders');
    console.log(`***Ledger: ${serLedgerOrders.toString()}`);

    // ottengo la lista attuale di tutti i farmaci nel ledger
    const serializedDrugs = await ctx.stub.getState('drugs');
    if (!serializedDrugs || serializedDrugs.length === 0){
      throw new Error('There are no drugs in the ledger');
    }


    let drugsList = JSON.parse(serializedDrugs.toString());
    console.log(`***Drugs: ${drugsList}`);

    const manufacturer = await this.GetManufacturer(ctx, maufacturerId);

    const producedDrugs = manufacturer.Drugs;
    console.log(`***Manufacturer: ${stringify(manufacturer)}`);

    const date = new Date();
    const prodDate = date.toISOString().slice(0,10);
    console.log(`***ProdDate: ${prodDate}`)
    date.setFullYear(date.getFullYear() + 1);
    const expDate = date.toISOString().slice(0,10);

    console.log(`***ExpDate: ${expDate}`)
    console.log(`***DrugsCodes: ${drugsCodes}`)
    console.log(`***ProducedDrugs: ${producedDrugs}`)
    // producedDrugs: lista di farmaci prodotti dal manufacturer
    // boxIDs: lista di numero di scatole di farmaci (la lunghezza è la quantità totale dell'ordine)
    // orderDrugs: lista di farmaci dell'ordine (oggetti con id  quantità dove dobbiamo aggiungere boxid)
    // drugsCodes: lista di codici di farmaci (la lunghezza è la quantità totale dell'ordine)


    for (let i=0; i<boxIDs.length; i++){
      console.log(i)
      try{
      let drugName = producedDrugs.find(d => d.DrugID === drugsCodes[i]).Name;
      console.log(`***DrugName: ${drugName}`)
      drugsList.push({BoxID: boxIDs[i], DrugID: drugsCodes[i], Name:drugName, ProductionDate: prodDate, ExpirationDate: expDate});
      orderDrugs.find(d => d.DrugID === drugsCodes[i]).BoxIDs.push(boxIDs[i]);
      console.log(`***OrderedDrugs: ${stringify(orderDrugs)}`);
      }
      catch(error){

        throw new Error(`The drug with ID ${drugsCodes[i]} is not produced by this manufacturer`);
      }
    }
    console.log(`***Drugs: ${drugsList}`);
    orders.find(o => o.ID === orderId).Drugs = orderDrugs;

    await ctx.stub.putState('orders', Buffer.from(stringify(sortKeysRecursive(orders))));
    await ctx.stub.putState('drugs', Buffer.from(stringify(sortKeysRecursive(drugsList))));

    console.log('*** Result: committed');

    return orders.find(o => o.ID === orderId);

  }

}
module.exports = ManufacturerContract;