'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class ManufacturerContract extends Contract{

  /**
   * Retrieves an order from the ledger by its ID.
   * @async
   * @function
   * @param {Context} ctx - The transaction context object.
   * @param {string} orderId - The ID of the order to retrieve.
   * @returns {Promise<Object>} The order object.
   * @throws Will throw an error if there are no orders in the ledger.
   */
  async GetOrder(ctx, orderId){
    const serializedOrders = await ctx.stub.getState('orders');
    if (!serializedOrders || serializedOrders.length === 0){
      throw new Error('There are no orders in the ledger');
    }
    const orders = JSON.parse(serializedOrders.toString());
    const order = orders.find(o => o.ID === orderId);
    return order;
  }

  /**
   *
   * @param {Context} ctx - The transaction context object.
   * @param {string} manufacturerId - The ID of the manufacturer.
   * @returns {Promise<Object>} The list of all orders as a string.
   * @throws Will throw an error if there are no orders in the ledger.
   */
  async GetAllOrders(ctx, manufacturerId){
    const serializedOrders = await ctx.stub.getState('orders');
    if (!serializedOrders || serializedOrders.length === 0){
      throw new Error('There are no orders in the ledger');
    }
    const orders = JSON.parse(serializedOrders.toString());
    const manufacturerOrders = orders.filter(o => o.ManufacturerID === manufacturerId);
    return manufacturerOrders;
  }

  /**
 * Retrieves all information about a patient from the ledger.
 * @async
 * @param {Context} ctx - The transaction context object
 * @param {string} userID - The ID of the patient to retrieve information for
 * @returns {Promise<Object>} - The user object containing all information
 * @throws Will throw an error if there are no patients in the ledger
 */
  async GetAllInfo(ctx, userID) {
    const serializedPharmacies = await ctx.stub.getState('pharmacies');
    const serializedManufacturers = await ctx.stub.getState('manufacturers');
    if (
      (!serializedManufacturers || serializedManufacturers.length === 0) &&
      (!serializedPharmacies || serializedPharmacies.length === 0)
    ) {
      throw new Error(`There are no users in the ledger`);
    }

    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const pharmacies = JSON.parse(serializedPharmacies.toString());
    const users = manufacturers.concat(pharmacies);

    const user = users.find(user => user.ID === userID);
    if (!user){
      throw new Error(`No user with id ${userID} in the ledger`);
    }

    return user;
  }


  /**
   * Retrieves an order from the ledger by its ID.
   * @param {Context} ctx The transaction context.
   * @param {string} orderId The ID of the order to retrieve.
   * @returns {Promise<Object>} The order object.
   * @throws Will throw an error if there are no orders in the ledger.
   */
  async GetName(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturers');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer.Name
  }


  /**
   * Retrieves a manufacturer from the ledger by ID.
   * @async
   * @function GetManufacturer
   * @param {Context} ctx - The transaction context.
   * @param {string} id - The ID of the manufacturer to retrieve.
   * @returns {Promise<Object>} The manufacturer object.
   * @throws Will throw an error if there are no manufacturers in the ledger.
   */
  async GetManufacturer(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturers');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer
  }


  /**
   * Retrieves an order from the ledger by its ID.
   * @param {Context} ctx - The transaction context object
   * @param {string} orderId - The ID of the order to retrieve
   * @returns {Promise<Object>} The order object
   * @throws Will throw an error if there are no orders in the ledger or if the specified order ID is not found
   */
  async GetAddress(ctx, id){
    const serializedManufacturers = await ctx.stub.getState('manufacturers');
    if (!serializedManufacturers || serializedManufacturers.length === 0){
      throw new Error('There are no manufacturers in the ledger');
    }
    const manufacturers = JSON.parse(serializedManufacturers.toString());
    const manufacturer = manufacturers.find(m => m.ID === id);
    return manufacturer.Address
  }

  /**
   * Retrieves all prescriptions for a given patient from the ledger.
   * @param {Context} ctx The transaction context
   * @returns {Promise<Array>} An array of prescriptions for the given patient
   * @throws Will throw an error if there are no prescriptions in the ledger
   */
	async GetAllBoxes(ctx) {
		const serializedBoxes = await ctx.stub.getState('boxes');
		if (!serializedBoxes || serializedBoxes.length === 0) {
			throw new Error(`There are no boxes in the ledger`);
		}
		const boxes = JSON.parse(serializedBoxes.toString());
		return boxes;
  }

  /**
	 *
	 * @param {*} ctx
   * @param {*} order = order already processed by BACKEND
	 * @param {*} updatedBoxes = boxes alrady updated by BACKEND
	 */
	async ProcessOrder(ctx, order, updatedBoxes) {
		const serializedOrders = await ctx.stub.getState("orders");
		const orders = JSON.parse(serializedOrders.toString());
    order = JSON.parse(order);
    updatedBoxes = JSON.parse(updatedBoxes);
    
    // Update the order
    const orderIndex = orders.indexOf(orders.find(o => o.ID === order.ID));
    orders[orderIndex] = order;
    console.log(`***New order: ${stringify(order)}`);
		await ctx.stub.putState("orders", Buffer.from(stringify(sortKeysRecursive(orders))));
		await ctx.stub.putState("boxes", Buffer.from(stringify(sortKeysRecursive(updatedBoxes))));
    return
	}

}
module.exports = ManufacturerContract;