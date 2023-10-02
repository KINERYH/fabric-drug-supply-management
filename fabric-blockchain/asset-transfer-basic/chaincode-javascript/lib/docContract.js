'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class DocContract extends Contract {

  async getAllPatients(ctx) {
    const allPatients = await ctx.stub.getState('patients');
    return allPatients;
  }

  async getPatient(ctx, cf) {
    const patients = await ctx.stub.getState('patients');

    return patient.toString();
  }

  async getPatientbyName(ctx, name, surrname) {
    const patient = await ctx.stub.getState(name+surrname);
    return patient.toString();
  }


}

module.exports = DocContract;