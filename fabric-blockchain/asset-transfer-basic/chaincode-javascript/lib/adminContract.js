'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


class AdminContract extends Contract {


	async CreateDoctor(ctx, user) {
		const serializedDoctors = await ctx.stub.getState('doctors');
		const doctors = JSON.parse(serializedDoctors.toString());
		
		const doctor = {
			"ID": user.ID,
			"Name": user.Name,
			"Surname": user.Surname,
			"Hospital": user.Hospital,
			"Specialization": user.Specialization
		};

		doctors.push(doctor);
		await ctx.stub.putState('doctors', Buffer.from(stringify(sortKeysRecursive(doctors))));
	}

	async CreateManufacturer(ctx, user) {
		const serializedManufacturers = await ctx.stub.getState('manufacturers');
		const manufacturers = JSON.parse(serializedManufacturers.toString());
		
		const manufacturer = {
			"ID": user.ID,
			"Name": user.Name,
			"Address": user.Address,
			"Drugs": []
		};

		manufacturers.push(manufacturer);
		await ctx.stub.putState('manufacturers', Buffer.from(stringify(sortKeysRecursive(manufacturers))));
	}

	async CreatePharmacy(ctx, user) {
		const serializedPharmacies = await ctx.stub.getState('pharmacies');
		const pharmacies = JSON.parse(serializedPharmacies.toString());
		
		const pharmacy = {
			"ID": user.ID,
			"Name": user.Name,
			"Address": user.Address,
			"DrugStorage": []
		};

		pharmacies.push(pharmacy);
		await ctx.stub.putState('pharmacies', Buffer.from(stringify(sortKeysRecursive(pharmacies))));
	}

}

module.exports = AdminContract;