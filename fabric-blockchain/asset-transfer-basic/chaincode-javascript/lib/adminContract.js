'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


class AdminContract extends Contract {


	async CreateDoctor(ctx, user) {
		const serializedDoctors = await ctx.stub.getState('doctors');
		const doctors = JSON.parse(serializedDoctors.toString());

		console.log("***INPUT DEL CONTRATTO: " + JSON.stringify(user) + "\n");

		const parsedUser = JSON.parse(user);
		
		const doctor = {
			ID: parsedUser["ID"],
			Name: parsedUser["Name"],
			Surname: parsedUser["Surname"],
			Hospital: parsedUser["Hospital"],
			Specialization: parsedUser["Specialization"]
		};

		console.log("***NEW DOCTOR: " + JSON.stringify(doctor));
		doctors.push(doctor);
		await ctx.stub.putState('doctors', Buffer.from(stringify(sortKeysRecursive(doctors))));
	}

	async CreateManufacturer(ctx, user) {
		const serializedManufacturers = await ctx.stub.getState('manufacturers');
		const manufacturers = JSON.parse(serializedManufacturers.toString());

		const parsedUser = JSON.parse(user);
		
		const manufacturer = {
			ID: parsedUser["ID"],
			Name: parsedUser["Name"],
			Address: parsedUser["Address"],
			Drugs: []
		};

		manufacturers.push(manufacturer);
		await ctx.stub.putState('manufacturers', Buffer.from(stringify(sortKeysRecursive(manufacturers))));
	}

	async CreatePharmacy(ctx, user) {
		const serializedPharmacies = await ctx.stub.getState('pharmacies');
		const pharmacies = JSON.parse(serializedPharmacies.toString());

		const parsedUser = JSON.parse(user);
		
		const pharmacy = {
			ID: parsedUser["ID"],
			Name: parsedUser["Name"],
			Address: parsedUser["Address"],
			DrugStorage: []
		};

		pharmacies.push(pharmacy);
		await ctx.stub.putState('pharmacies', Buffer.from(stringify(sortKeysRecursive(pharmacies))));
	}

}

module.exports = AdminContract;