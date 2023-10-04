'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const { v4: uuidv4 } = require('uuid');


class DoctorContract extends Contract {


  /**
   * Retrieves all the prescriptions made by a specific doctor from the ledger.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} docID - The ID of the doctor.
   * @returns {Promise<string>} - The list of all prescriptions as a string.
   */
  async GetAllPrescriptions(ctx, docID) {
    const serializedPrescriptions = await ctx.stub.getState('prescriptions');
    if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
      throw new Error(`There are no prescriptions in the ledger`);
    }
    const prescriptions = JSON.parse(serializedPrescriptions.toString());
    const docPrescriptions = prescriptions.filter(prescription => prescription.DoctorID === docID);
    return docPrescriptions;
  }


  /**
   * Get the name of a doctor with the given ID.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} docID - The ID of the doctor to retrieve the name for.
   * @returns {string} - The name of the doctor with the given ID.
   * @throws Will throw an error if there are no doctors in the ledger.
   */
  async GetName(ctx, docID) {
    const serializedDoctors = await ctx.stub.getState('doctors');
    if (!serializedDoctors || serializedDoctors.length === 0) {
      throw new Error(`There are no doctors in the ledger`);
    }
    const doctors = JSON.parse(serializedDoctors.toString());
    const doctor = doctors.find(doctor => doctor.ID === docID);
    return doctor.Name;
  }

  /**
   * Get the surname of a doctor with the given ID.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} docID - The ID of the doctor to retrieve the name for.
   * @returns {string} - The surname of the doctor with the given ID.
   * @throws Will throw an error if there are no doctors in the ledger.
   */
  async GetSurname(ctx, docID) {
    const serializedDoctors = await ctx.stub.getState('doctors');
    if (!serializedDoctors || serializedDoctors.length === 0) {
      throw new Error(`There are no doctors in the ledger`);
    }
    const doctors = JSON.parse(serializedDoctors.toString());
    const doctor = doctors.find(doctor => doctor.ID === docID);
    return doctor.Surname;
  }

  /**
   * Get the Hospital of a doctor with the given ID.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} docID - The ID of the doctor to retrieve the name for.
   * @returns {string} - The Hospital of the doctor with the given ID.
   * @throws Will throw an error if there are no doctors in the ledger.
   */
  async GetHospital(ctx, docID) {
    const serializedDoctors = await ctx.stub.getState('doctors');
    if (!serializedDoctors || serializedDoctors.length === 0) {
      throw new Error(`There are no doctors in the ledger`);
    }
    const doctors = JSON.parse(serializedDoctors.toString());
    const doctor = doctors.find(doctor => doctor.ID === docID);
    return doctor.Hospital;
  }

  /**
   * Get the specialization of a doctor with the given ID.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} docID - The ID of the doctor to retrieve the name for.
   * @returns {string} - The specialization of the doctor with the given ID.
   * @throws Will throw an error if there are no doctors in the ledger.
   */
  async GetSpecialization(ctx, docID) {
    const serializedDoctors = await ctx.stub.getState('doctors');
    if (!serializedDoctors || serializedDoctors.length === 0) {
      throw new Error(`There are no doctors in the ledger`);
    }
    const doctors = JSON.parse(serializedDoctors.toString());
    const doctor = doctors.find(doctor => doctor.ID === docID);
    return doctor.Specialization;
  }

   /**
   * Check if a prescription exists.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} prescriptionID - The ID of the prescription to check.
   * @returns {boolean} - True or False.
   * @throws Will throw an error if the prescription already exists.
   */
  async PresciptionExists(ctx, prescriptionID) {
    const prescriptions = await ctx.stub.getState('prescriptions');
    if (!prescriptions || prescriptions.length === 0) {
      throw new Error(`No prescription in the ledger`);
    }
    const exist = prescriptions.find(prescription => prescription.ID === prescriptionID)
    if (exist) {
      throw new Error(`Prescription ${prescriptionID} already exists`);
    }
    return exist;
  }

  //GUARDA async InitLedger(ctx, initState) l'oggetto dovrebbe essere stringificato prima di essere passato,
  //es. https://github.com/tulios/kafkajs/issues/1019
  async CreatePrescription(ctx, docID, patientID, drugs, description) {
    let prescriptionID = uuidv4();
    const exists = await this.PresciptionExists(ctx, prescriptionID);
    while (exists) {
      prescriptionID = uuidv4();
    }

    const prescription = {
      DoctorID: docID,
      PatientID: patientID,
      Drugs: drugs,
      Description: description,
      Status: "pending"
    };
    await ctx.stub.putState('prescriptions', Buffer.from(sortKeysRecursive(prescription)));
    return JSON.stringify(prescription);
  }



}

module.exports = DoctorContract;