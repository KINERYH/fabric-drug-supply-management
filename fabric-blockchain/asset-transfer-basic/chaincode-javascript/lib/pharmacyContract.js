'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class PharmacyContract extends Contract {

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} id = pharmacy id
	 * @returns the name of the pharmacy with the given id
	 */
	async GetName(ctx, id) {
		const serializedPharmacies = await ctx.stub.getState("pharmacies"); 
		if (!serializedPharmacies || serializedPharmacies.length === 0) {
			throw new Error(`Pharmacies not found`);
		}
		const pharmacies = JSON.parse(serializedPharmacies.toString()); 
		const pharmacy = pharmacies.find((p) => p.ID === id) || {};
		if (!pharmacy) {
			throw new Error(`Pharmacy with ID ${id} not found`);
		}
		return pharmacy.Name;
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} id = pharmacy id
	 * @returns the address of the pharmacy with the given id
	 */
	async GetAddress(ctx, id) {
		const serializedPharmacies = await ctx.stub.getState("pharmacies"); 
		if (!serializedPharmacies || serializedPharmacies.length === 0) {
			throw new Error(`Pharmacies not found`);
		}
		const pharmacies = JSON.parse(serializedPharmacies.toString()); 
		const pharmacy = pharmacies.find((p) => p.ID === id) || {};
		if (!pharmacy) {
			throw new Error(`Pharmacy with ID ${id} not found`);
		}
		return pharmacy.Address;
	}
	
	
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
		if (!pharmacy) {
			throw new Error(`Pharmacy with ID ${id} not found`);
		}
		return pharmacy.DrugStorage;

	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugId = drug id
	 * @returns the name of the drug with the given id
	 */
	async GetDrugName(ctx, drugId) {
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
			let drugName = await this.GetDrugName(ctx, drugId);
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

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} pharmacyID = pharmacy id
	 * @param {*} drugName = drug name
	 * @returns the quantity of the drug with the given name in the storage of the pharmacy with the given id
	 */
	async GetDrugQuantity(ctx, pharmacyID, drugName) {
		const drugsListID = await this.GetPharmacyStorage(ctx, pharmacyID);

		const quantity = 0;

		for(const drugId of drugsListID){
			let name = await this.GetDrugName(ctx, drugId);
			if(name === drugName){
				quantity++;
			}
		}
		return quantity;
	}

	async GetDrugID(ctx, pharmacyID, drugName) {
		const drugsIDs = await this.GetPharmacyStorage(ctx, pharmacyID);

		const drugId = "";

		for(const id of drugsIDs){
			let name = await this.GetDrugName(ctx, id);
			if(name === drugName){
				return id;
			}
		}
		
		if(drugId === ""){
			throw new Error(`Drug with name ${drugName} not found in the pharmacy with ID ${pharmacyID}`);
		}
	}


	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} prescriptionID = prescription id
	 * returns the prescription with the given id
	 */
	async GetPrescription(ctx, prescriptionID) {
		const prescriptions = await ctx.stub.getState("prescriptions");
		if (!prescriptions || prescriptions.length === 0) {
			throw new Error(`Prescriptions not found`);
		}
		const prescriptionsList = JSON.parse(prescriptions.toString());
		const prescription = prescriptionsList.find((p) => p.ID === prescriptionID);
  		if (!prescription) {
			throw new Error(`Prescription with ID ${prescriptionID} not found`);
  		}
  		return prescription;
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} pharmacyID = pharmacy id
	 * @param {*} drugName = drug name
	 * @param {*} requestedQuantity = requested quantity for the drug
	 * @returns true if the requested quantity is available in the pharmacy storage, false otherwise
	 */
	async CheckAvailability(ctx, pharmacyID, drugName, requestedQuantity) {
		const actualQuantity = await this.GetDrugQuantity(ctx, pharmacyID, drugName);
		if(requestedQuantity > actualQuantity){
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} pharmacyID = pharmacy id
	 * @param {*} prescriptionID = prescription id
	 * @param {*} drugsList = list of drugs in the prescription
	 */
	async ProcessPrescription(ctx, pharmacyID, prescriptionID) {
		const prescription = await this.GetPrescription(ctx, prescriptionID);
		if(prescription.PharmacyID !== null){
			throw new Error(`Prescription with ID ${prescriptionID} has already been processed`);
		} else {
			const listIDs = [];
			const drugsList = prescription.Drugs;
			for(let requestedDrug of drugsList){
				let actualQuantity = await this.GetDrugQuantity(ctx, pharmacyID, requestedDrug.Name);
				let requestedQuantity = requestedDrug.Quantity;
				if(requestedQuantity > actualQuantity){
					throw new Error(
						`Prescription with ID ${prescriptionID} cannot be processed because the drug ` +
						`${drugName} is missing ${requestedQuantity - actualQuantity} pieces in ` +
						`the pharmacy ${this.GetName(ctx, pharmacyID)} `
					  );
				} else {
					// Take the drugIDs from the pharmacy storage
					for(let i = 0; i < requestedQuantity; i++){
						let drugId = this.GetDrugID(ctx, pharmacyID, requestedDrug.Name);
						listIDs.push(drugId);
					}
				}
			}
			// Update the storage of the pharmacy:
			// 1) Take the pharmacies and the specific pharmacy with the given id
			const pharmacies = await ctx.stub.getState("pharmacies");
			const pharmacy = pharmacies.find((p) => p.ID === pharmacyID);
			// 2) Update the pharmacy with the new storage:
			// 2a) Take the old storage
			const newStorage = await this.GetPharmacyStorage(ctx, pharmacyID);
			// 2b) Remove the drugs in the listIDs from the storage 
			for(let drugId of listIDs){
				let index = newStorage.indexOf(drugId);
				if(index > -1){
					newStorage.splice(index, 1);
				}
			}
			// 2c) Update the pharmacy with the new storage
			pharmacy.DrugStorage = newStorage;
			// 3) Substitute the old pharmacy with the updated one
			const pharmacyIndex = pharmacies.findIndex((p) => p.ID === pharmacyID);
			pharmacies[pharmacyIndex] = pharmacy;
			// 4) Put the pharmacies list in the world state
			await ctx.stub.putState("pharmacies", Buffer.from(JSON.stringify(sortKeysRecursive(pharmacies))));

			// Add the drug IDs in the prescription and update the prescription state:
			// 1) Take the prescriptions
			const prescriptions = await ctx.stub.getState("prescriptions");
			// 2) Update the prescription with the new status
			prescription.Status = "processed";
			// 3) Add the DrugIDs in the prescription
			prescription.DrugIDs = listIDs;
			// 4) Put the prescriptions list in the world state
			const prescriptionIndex = prescriptions.findIndex((p) => p.ID === prescriptionID);
			prescriptions[prescriptionIndex] = prescription;
			await ctx.stub.putState("prescriptions", Buffer.from(JSON.stringify(sortKeysRecursive(prescriptions))));

			console.log("Prescription processed successfully");
		}
	}

}

module.exports = PharmacyContract;