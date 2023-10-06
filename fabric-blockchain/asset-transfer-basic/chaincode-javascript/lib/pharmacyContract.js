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
		// console.log(`DrugStorage: ${pharmacy.DrugStorage}`);
		// console.log(typeof(pharmacy.DrugStorage));
		// const test = JSON.parse(pharmacy.DrugStorage.toString());
		// console.log(`DrugStorage jsonparsetostring: ${test}`);
		const drugStorageArray = pharmacy.DrugStorage.toString().split(',');

		return drugStorageArray;
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

		let quantity = 0;

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
	 * @param {*} prescriptionID = prescription id
	 * @param {*} drugsList = list of drugs in the prescription
	 */
	async ProcessPrescription(ctx, prescriptionID, pharmacyID) {
		let prescription = await this.GetPrescription(ctx, prescriptionID);
		console.log(`*** PRESCRIPTION: ${prescription}`);
		if(prescription.PharmacyID !== null){
			throw new Error(`Prescription with ID ${prescriptionID} has already been processed`);
		} else {
			let listIDs = [];
			console.log(`*** listIDs (before): ${listIDs}`);
			const drugsList = prescription.Drugs;
			for(let requestedDrug of drugsList){
				const actualQuantity = await this.GetDrugQuantity(ctx, pharmacyID, requestedDrug.Name);
				const requestedQuantity = requestedDrug.Quantity;
				if(requestedQuantity > actualQuantity){
					throw new Error(
						`Prescription with ID ${prescriptionID} cannot be processed because the drug ` +
						`${requestedDrug.Name} is missing ${requestedQuantity - actualQuantity} pieces in ` +
						`the pharmacy ${this.GetName(ctx, pharmacyID)} `
					  );
				} else {
					// Take the drugIDs from the pharmacy storage
					for(let i = 0; i < requestedQuantity; i++){
						let drugId = await this.GetDrugID(ctx, pharmacyID, requestedDrug.Name);
						// TODO: Remove the drug from the pharmacy storage otherwise it will be taken again the same
						listIDs.push(drugId);
						console.log(`*** listIDs (iteration ${i}): ${listIDs}`);
					}
				}
			}
			console.log(`*** listIDs (after): ${listIDs}`);
			// Update the storage of the pharmacy:
			// 1) Take the pharmacies and the specific pharmacy with the given id
			const serializedPharmacies = await ctx.stub.getState("pharmacies");
			if (!serializedPharmacies || serializedPharmacies.length === 0) {
				throw new Error(`Pharmacies not found`);
			}
			const pharmacies = JSON.parse(serializedPharmacies.toString());
			const pharmacyIndex = pharmacies.findIndex((p) => p.ID === pharmacyID);

			// let pharmacy = pharmacies.find((p) => p.ID === pharmacyID);
			// console.log("*** Pharmacy ***");
			// console.log(typeof(pharmacy));
			// console.log(`${pharmacy}`);

			// 2) Update the pharmacy with the new storage:
			// 2a) Take the old storage
			let newStorage = await this.GetPharmacyStorage(ctx, pharmacyID);
			console.log("New storage (original): " + newStorage);
			// 2b) Remove the drugs in the listIDs from the storage
			for(let drugId of listIDs){
				let index = newStorage.indexOf(drugId);
				if(index > -1){
					newStorage.splice(index, 1);
				}
			}
			console.log("(let) New storage (edited): " + newStorage);
			// 2c) Update the pharmacy with the new storage
			pharmacies[pharmacyIndex].DrugStorage = newStorage;
			// 3) Substitute the old pharmacy with the updated one

			// pharmacies[pharmacyIndex] = pharmacy;
			// 4) Put the pharmacies list in the world state
			await ctx.stub.putState("pharmacies", Buffer.from(stringify(sortKeysRecursive(pharmacies))));

			// Add the drug IDs in the prescription and update the prescription state:
			// 1) Take the prescriptions
			const serializedPrescriptions = await ctx.stub.getState("prescriptions");
			if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
				throw new Error(`Prescriptions not found`);
			}
			const prescriptions = JSON.parse(serializedPrescriptions.toString());

			const prescriptionIndex = prescriptions.findIndex((p) => p.ID === prescriptionID);

			if(prescriptionIndex === -1){
				throw new Error(`Prescription with ID ${prescriptionID} not found`);
			}

			prescriptions[prescriptionIndex].Status = "processed";

			prescriptions[prescriptionIndex].DrugIDs = listIDs;

			prescriptions[prescriptionIndex].PharmacyID = pharmacyID;

			// // 2) Update the prescription with the new status
			// prescription.Status = "processed";
			// // 3) Add the DrugIDs in the prescription
			// prescription.DrugIDs = listIDs;
			// // 4) Add the pharmacyID in the prescription
			// prescription.PharmacyID = pharmacyID;
			// // 5) Put the prescriptions list in the world state
			// const prescriptionIndex = prescriptions.findIndex((p) => p.ID === prescriptionID);
			// prescriptions[prescriptionIndex] = prescription;


			await ctx.stub.putState("prescriptions", Buffer.from(stringify(sortKeysRecursive(prescriptions))));

			console.log(' *** PRESCRIPTIONS: ');
			console.log(prescriptions);

			console.log(" *** PHARMACIES: ");
			console.log(pharmacies);

			console.log("Prescription processed successfully");
			return { prescriptions, pharmacies };
		}
	}


}

module.exports = PharmacyContract;