'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class PharmacyContract extends Contract {

	// TODO: Do I need the constructor?

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} id = pharmacy id
	 * @returns list of all the IDs of the drugs in the pharmacy
	 */
	async GetPharmacyStorage(ctx, id) {
		const serializedPharmacies = await ctx.stub.getState("pharmacies"); 
        if (!serializedPharmacies || serializedPharmacies.length === 0) {
            throw new Error(`Pharmacies not found`);
        }
		const pharmacies = JSON.parse(serializedPharmacies.toString()); 
		const pharmacy = pharmacies.find((p) => p.ID === id) || {};
		return pharmacy.DrugStorage;

	}


	/**
	 * 
	 * @param {*} ctx 
	 * @param {String} id = user id
	 * @returns list of all the drugs in the pharmacy with their quantities
	 */
	async GetAllDrugs(ctx, id) {

		const drugsListID = await this.GetPharmacyStorage(ctx, id);

		// The idea is to populate an hash map {name, quantity} by looking at all the drug IDs 
		// and then to return them as a JSON
		
		// const  = new Map();

	}

}

module.exports = PharmacyContract;