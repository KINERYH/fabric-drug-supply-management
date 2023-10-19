'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


class AdminContract extends Contract {


	async CreateDoctor(ctx, doctorID, name, surname, hospital, specialization) {
		const serializedDoctors = await ctx.stub.getState('doctors');
		const doctors = JSON.parse(serializedDoctors.toString());
		
		const doctor = {
			"ID": doctorID,
			"Name": name,
			"Surname": surname,
			"Hospital": hospital,
			"Specialization": specialization
		};

		doctors.push(doctor);
		await ctx.stub.putState('doctors', Buffer.from(stringify(sortKeysRecursive(prescriptionsList))));
	}

	async CreateManufacturer(ctx, manufacturerID, name, address) {
		const serializedManufacturers = await ctx.stub.getState('manufacturers');
		const manufacturers = JSON.parse(serializedManufacturers.toString());
		
		const manufacturer = {
			"ID": manufacturerID,
			"Name": name,
			"Address": address,
			"Drugs": []
		};

		manufacturers.push(manufacturer);
		await ctx.stub.putState('manufacturers', Buffer.from(stringify(sortKeysRecursive(manufacturers))));
	}

	async CreatePharmacy(ctx, pharmacyID, name, address) {
		const serializedPharmacies = await ctx.stub.getState('pharmacies');
		const pharmacies = JSON.parse(serializedPharmacies.toString());
		
		const pharmacy = {
			"ID": pharmacyID,
			"Name": name,
			"Address": address,
			"DrugStorage": []
		};

		pharmacies.push(pharmacy);
		await ctx.stub.putState('pharmacies', Buffer.from(stringify(sortKeysRecursive(pharmacies))));
	}

}

module.exports = AdminContract;