'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class PharmacyContract extends Contract {
	async PutUser(ctx, user) {
    user = JSON.parse(user);
    console.log("try to insert in the ledger:");
    console.log(user);
    const serializedPharmacies = await ctx.stub.getState('pharmacies');
    const pharmacies = JSON.parse(serializedPharmacies.toString());

    const exists = pharmacies.find(pharmacy => pharmacy.ID === user.ID)
    if(exists) {
      throw new Error(`Pharmacy already exist`);
    }
    // remove password attribute if exists
    delete user.password;
    // put new user
    doctors.push(user);
    console.log(pharmacies);
    await ctx.stub.putState('pharmacies', Buffer.from(stringify(sortKeysRecursive(pharmacies))));
    console.log("Successfully added new pharmacy.")
    return user;
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
		const serializedPatients = await ctx.stub.getState('patients');
		const serializedDoctors = await ctx.stub.getState('doctors');
		const serializedPharmacies = await ctx.stub.getState('pharmacies');
		if (
			(!serializedPatients || serializedPatients.length === 0) &&
			(!serializedDoctors || serializedDoctors.length === 0)   &&
			(!serializedPharmacies || serializedPharmacies.length === 0)
		) {
			throw new Error(`There are no users in the ledger`);
		}

		const patients = JSON.parse(serializedPatients.toString());
		const doctors = JSON.parse(serializedDoctors.toString());
		const pharmacies = JSON.parse(serializedPharmacies.toString());
		const users = patients.concat(doctors, pharmacies);

		const user = users.find(user => user.ID === userID);
		if (!user){
			throw new Error(`No user with id ${userID} in the ledger`);
		}

		return user;
	}

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
		// const drugStorageArray = pharmacy.DrugStorage.toString().split(',');

		return pharmacy.DrugStorage;
	}

	

	/**
	 *
	 * @param {*} drugID = drug id
	 * @param {*} pharmacyStorage = pharmacy storage
	 * @returns the quantity of the drug with the given id in the pharmacy storage
	 * @throws an error if the drug is not found
	 */
	GetDrugQuantity(drugID, pharmacyStorage) {
		for(let drug of pharmacyStorage){
			if(drug.DrugID === drugID){
				return drug.Quantity;
			}
		}
		throw new Error(`Drug with ID ${drugID} not found in the pharmacy storage`);
	}

	/**
	 *
	 * @param {*} drugID = drug id
	 * @param {*} drugStorage = drug storage of the pharmacy
	 * @returns the boxID of the drug with the given id in the pharmacy storage
	 * throws an error if the drug is not found
	 */
	GetBoxID(drugID, drugStorage) {
		for(let drug of drugStorage){
			if(drug.DrugID === drugID){
				return drug.BoxIDs[0];
			}
		}

		throw new Error(`Drug with ID ${drugID} not found in the pharmacy storage`);

	}

	/**
 * Retrieves all prescriptions that have been processed by the pharmacy.
 * @param {Context} ctx The transaction context
 * @param {string} pharmacyID The ID of the pharmacy to retrieve prescriptions for
 * @returns {Promise<Array>} An array of prescriptions for the given pharmacy
 * @throws Will throw an error if there are no prescriptions in the ledger
 */
	async GetAllPrescriptions(ctx, pharmacyID) {
		const serializedPrescriptions = await ctx.stub.getState('prescriptions');
		if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
			throw new Error(`There are no prescriptions in the ledger`);
		}
		const prescriptions = JSON.parse(serializedPrescriptions.toString());
		const pharmacyPrescriptions = prescriptions.filter(prescription => prescription.PharmacyID === pharmacyID);
		return pharmacyPrescriptions;
	}


	/**
 * Retrieves all orders that have been made by the pharmacy.
 * @param {Context} ctx The transaction context
 * @param {string} pharmacyID The ID of the pharmacy to retrieve orders for
 * @returns {Promise<Array>} An array of orders for the given pharmacy
 * @throws Will throw an error if there are no prescriptions in the ledger
 */
	async GetAllOrders(ctx, pharmacyID) {
		const serializedOrders = await ctx.stub.getState('orders');
		if (!serializedOrders || serializedOrders.length === 0) {
			throw new Error(`There are no orders in the ledger`);
		}
		const orders = JSON.parse(serializedOrders.toString());
		const pharmacyOrders = orders.filter(o => o.PharmacyID === pharmacyID);
		return pharmacyOrders;
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
	 * returns the updated prescription
	 */
	async ProcessPrescription(ctx, prescriptionID, pharmacyID, processingDate) {
		// Get the pharmacy
		const serializedPharmacies = await ctx.stub.getState("pharmacies");
		if (!serializedPharmacies || serializedPharmacies.length === 0) {
			throw new Error(`Pharmacies not found`);
		}
		const pharmacies = JSON.parse(serializedPharmacies.toString());
		const pharmacyIndex = pharmacies.findIndex((p) => p.ID === pharmacyID);
		if(pharmacyIndex === -1){
			throw new Error(`Pharmacy with ID ${pharmacyID} not found`);
		}
		const pharmacy = pharmacies[pharmacyIndex];

		// Get the prescription
		const serializedPrescriptions = await ctx.stub.getState("prescriptions");
		if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
			throw new Error(`Prescriptions not found`);
		}
		const prescriptions = JSON.parse(serializedPrescriptions.toString());
		const prescriptionIndex = prescriptions.findIndex((p) => p.ID === prescriptionID);

		if(prescriptionIndex === -1){
			throw new Error(`Prescription with ID ${prescriptionID} not found`);
		}
		const prescription = prescriptions[prescriptionIndex];

		// Check if the prescription has already been processed
		if(prescription.PharmacyID !== null){
			throw new Error(`Prescription with ID ${prescriptionID} has already been processed`);
		} else {
			const boxesMap = new Map();
			const drugsList = prescription.Drugs;
			for(let requestedDrug of drugsList){
				const actualQuantity = this.GetDrugQuantity(requestedDrug.DrugID, pharmacy.DrugStorage);
				const requestedQuantity = requestedDrug.Quantity;
				if(requestedQuantity > actualQuantity){
					throw new Error(
						`Prescription with ID ${prescriptionID} cannot be processed because the drug ` +
						`${requestedDrug.DrugID} is missing ${requestedQuantity - actualQuantity} pieces in ` +
						`the pharmacy ${pharmacy.Name} `
					  );
				} else {
					// Take the boxIDs from the pharmacy storage
					for(let i = 0; i < requestedQuantity; i++){
						let boxID = this.GetBoxID(requestedDrug.DrugID, pharmacy.DrugStorage);
						if(boxesMap.has(requestedDrug.DrugID)){
							let prevBoxIDs = boxesMap.get(requestedDrug.DrugID);
							prevBoxIDs.push(boxID);
							boxesMap.set(requestedDrug.DrugID, prevBoxIDs);
						} else {
							boxesMap.set(requestedDrug.DrugID, [boxID]);
						}
						// Remove the boxID from the pharmacy storage and update the quantity
						let drugIndex = pharmacy.DrugStorage.findIndex((d) => d.DrugID === requestedDrug.DrugID);
						pharmacy.DrugStorage[drugIndex].Quantity--;
						// Since I took the first element of the array, I should remove it from the list
						pharmacy.DrugStorage[drugIndex].BoxIDs.shift();

					}
				}
			}

			// Update the pharmacy state
			pharmacies[pharmacyIndex] = pharmacy;
			await ctx.stub.putState("pharmacies", Buffer.from(stringify(sortKeysRecursive(pharmacies))));

			// Add the drug IDs in the prescription and update the prescription state:
			prescriptions[prescriptionIndex].Status = "processed";

			prescriptions[prescriptionIndex].PharmacyID = pharmacyID;

			prescriptions[prescriptionIndex].ProcessingDate = processingDate;

			prescriptions[prescriptionIndex].Drugs = drugsList.map((drug) => {
				drug.BoxIDs = boxesMap.get(drug.DrugID);
				return drug;
			});

			await ctx.stub.putState("prescriptions", Buffer.from(stringify(sortKeysRecursive(prescriptions))));

			return prescriptions[prescriptionIndex];
		}
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
	 * Retrieves info for a given drugID.
	 * @param {Context} ctx - The transaction context object.
	 * @param {string} drugID - The ID of the drug.
	 * @returns {Promise<Object>} - An object of drug.
	 * @throws Will throw an error if there are no drug with the specified drugID.
	 */
	async GetDrug(ctx, drugID) {
		const serializedDrugs = await ctx.stub.getState('drugs');
		if (!serializedDrugs || serializedDrugs.length === 0) {
			throw new Error(`There are no drugs in the ledger`);
		}
		const drugs = JSON.parse(serializedDrugs.toString());
		const drug = drugs.find(drug => drug.DrugID === drugID);
		if (!drug){
			throw new Error(`No drug with id ${drugID} in the ledger`);
		}
		return drug;
	}


	/**
	 *
	 * @param {*} ctx
	 * @param {*} pharmacyID = pharmacy id
	 * @param {*} orderID = order id
	 * @param {*} manufacturerID = manufacturer id
	 * @param {*} drugs = JSON list of objects {DrugID: "drug id", Quantity: "quantity"}
	 * @param {*} description
	 */
	async RequestOrder(ctx, pharmacyID, orderID, manufacturerID, drugs, description) {
		const serializedOrders = ctx.stub.getState("orders");
		if (!serializedOrders || serializedOrders.length === 0) {
			throw new Error(`Orders not found`);
		}

		const orders = JSON.parse(serializedOrders.toString());

		const exist = orders.find((o) => o.ID === orderID);
		if(exist){
			throw new Error(`Order with ID ${orderID} already exists`);
		}

		const order = {
			ID: orderID,
			PharmacyID: pharmacyID,
			ManufacturerID: manufacturerID,
			Status: "pending",
			Description: description,
			Drugs: JSON.parse(drugs)
		};

		orders.push(order);
		await ctx.stub.putState("orders", Buffer.from(stringify(sortKeysRecursive(orders))));
	}

	/**
	 *
	 * @param {*} ctx
	 * @param {*} pharmacyID = pharmacy id
	 * @param {*} orderID = order id
	 */
	async ProcessOrder(ctx, orderID, pharmacyID) {
		const serializedOrders = await ctx.stub.getState("orders");
		const serializedPharmacies = await ctx.stub.getState("pharmacies");

		const orders = JSON.parse(serializedOrders.toString());
		const pharmacies = JSON.parse(serializedPharmacies.toString());

		console.log("***Orders: " + stringify(orders));


		const orderIndex = orders.findIndex((o) => o.ID === orderID);
		if(orderIndex === -1){
			throw new Error(`Order with ID ${orderID} not found`);
		}
		const order = orders[orderIndex];
		if(order.PharmacyID !== pharmacyID){
			throw new Error(`Order with ID ${orderID} cannot be processed because it does not belong to the pharmacy with ID ${pharmacyID}`);
		}

		if(order.Status !== "shipped"){
			throw new Error(`Order ${orderID} cannot be processed because it has not been shipped yet`);
		}

		// Update the pharmacy storage
		const pharmacyIndex = pharmacies.findIndex((p) => p.ID === pharmacyID);
		if(pharmacyIndex === -1){
			throw new Error(`Pharmacy with ID ${pharmacyID} not found`);
		}
		const pharmacy = pharmacies[pharmacyIndex];

		for(let drug of order.Drugs){
			const drugIndex = pharmacy.DrugStorage.findIndex((d) => d.DrugID === drug.DrugID);
			// If the drug is not in the pharmacy storage, I add it
			if(drugIndex === -1){
				pharmacy.DrugStorage.push({
					DrugID: drug.DrugID,
					Quantity: drug.Quantity,
					BoxIDs: drug.BoxIDs
				});
			} else {
				// If the drug is already in the pharmacy storage, I update the quantity and the boxIDs
				pharmacy.DrugStorage[drugIndex].Quantity += drug.Quantity;
				pharmacy.DrugStorage[drugIndex].BoxIDs.push(...drug.BoxIDs);
			}
		}

		pharmacies[pharmacyIndex] = pharmacy;
		await ctx.stub.putState("pharmacies", Buffer.from(stringify(sortKeysRecursive(pharmacies))));

		// Update the order state
		orders[orderIndex].Status = "processed";
		await ctx.stub.putState("orders", Buffer.from(stringify(sortKeysRecursive(orders))));

	}

	/**
	 *
	 * @param {*} ctx
	 * @returns a list of all the manufacturers
	 */
	async GetAllManufacturers(ctx) {
		const serializedManufacturers = await ctx.stub.getState("manufacturers");
		if (!serializedManufacturers || serializedManufacturers.length === 0) {
			throw new Error(`Manufacturers not found`);
		}
		const manufacturers = JSON.parse(serializedManufacturers.toString());
		return manufacturers;
	}


}

module.exports = PharmacyContract;