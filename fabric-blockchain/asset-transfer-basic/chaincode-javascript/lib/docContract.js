'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class DoctorContract extends Contract {

  async getAllPatients(ctx) {
    const allPatients = await ctx.stub.getState('patients');
    return allPatients.toString();
  }

  async getPatient(ctx, cf) {
    const patient = await ctx.stub.getState('patients');
    
    return patient.toString();
  }

  async getPatientbyName(ctx, name, surrname) {
    const patient = await ctx.stub.getState(name+surrname);
    return patient.toString();
  }


}