'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class DoctorContract extends Contract {

  async GetAllPatients(ctx) {
    const allPatients = await ctx.stub.getState('patients');
    return allPatients.toString();
  }

  async GetPatient(ctx, cf) {
    const patient = await ctx.stub.getState('patients');
    
    return patient.toString();
  }

  async GetPatientbyName(ctx, name, surrname) {
    const patient = await ctx.stub.getState(name+surrname);
    return patient.toString();
  }

}

module.exports = DoctorContract;