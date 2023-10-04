'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class PharmacyContract extends Contract {

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} id = pharmacy id
	 * @returns a list of all the IDs of the drugs in the pharmacy
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

	async getDrugName(ctx, drugId) {
		const drugs = await ctx.stub.getState("drugs");
		if (!drugs || drugs.length === 0) {
			throw new Error(`Drugs not found`);
		}
		const drugsList = JSON.parse(drugs.toString());
		const drug = drugsList.find((d) => d.ID === drugId);
  		if (!drug) {
    		throw new Error(`Drug with ID ${drugId} not found`);
  		}
  		return drug.Name;
	}


	/**
	 * 
	 * @param {*} ctx 
	 * @param {String} id = user id
	 * @returns JSON list of all the drugs in the pharmacy with their quantities
	 */
	async GetAllDrugs(ctx, id) {

		const drugsListID = await this.GetPharmacyStorage(ctx, id);

		const drugsMap = new Map();

		for(const drugId of drugsListID){
			let drugName = await this.getDrugName(ctx, drugId);
			if(drugsMap.has(drugName)){
				drugsMap.set(drugName, drugsMap.get(drugName) + 1);
			} else {
				drugsMap.set(drugName, 1);
			}
		}

		// // Convert drugsMap to an array of objects [{drugName: quantity}]
		// const drugsArray = Array.from(drugsMap.entries()).map(([drugName, quantity]) => ({
		// [drugName]: quantity,
		// }));
	
		// return JSON.stringify(drugsArray);

		// Convert drugsMap to an array of objects with "drugName" and "quantity" properties
		const drugsArray = Array.from(drugsMap.entries()).map(([drugName, quantity]) => ({
		drugName: drugName,
		quantity: quantity,
		}));
	
		return drugsArray;
	}

}

module.exports = PharmacyContract;