'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {


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
   * Retrieves all prescriptions for a given patient from the ledger.
   * @param {Context} ctx The transaction context
   * @param {string} patientID The ID of the patient to retrieve prescriptions for
   * @returns {Promise<Array>} An array of prescriptions for the given patient
   * @throws Will throw an error if there are no prescriptions in the ledger
   */
  async GetAllPrescriptions(ctx, patientID) {
    const serializedPrescriptions = await ctx.stub.getState('prescriptions');
    if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
      throw new Error(`There are no prescriptions in the ledger`);
    }
    const prescriptions = JSON.parse(serializedPrescriptions.toString());
    const patientPrescriptions = prescriptions.filter(prescription => prescription.PatientID === patientID);
    return patientPrescriptions;
  }

    /**
   * Retrieves all prescriptions for a given patient from the ledger.
   * @param {Context} ctx The transaction context
   * @param {string} patientID The ID of the patient to retrieve prescriptions for
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
   * Retrieves all pending prescriptions for a given patient from the ledger.
   * @param {Context} ctx - The transaction context object.
   * @param {string} patientID - The ID of the patient whose prescriptions are being retrieved.
   * @returns {Promise<Array>} - An array of prescription objects with a status of "Pending".
   * @throws Will throw an error if there are no prescriptions in the ledger.
   */
  async GetPendingPrescriptions(ctx, patientID) {
    const serializedPrescriptions = await ctx.stub.getState('prescriptions');
    if (!serializedPrescriptions || serializedPrescriptions.length === 0) {
      throw new Error(`There are no prescriptions in the ledger`);
    }
    const prescriptions = JSON.parse(serializedPrescriptions.toString());
    const patientPrescriptions = prescriptions.filter(prescription => prescription.PatientID === patientID && prescription.Status === "Pending");
    return patientPrescriptions;
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
   * Updates the information of a patient with the given ID.
   * @param {Context} ctx - The transaction context object
   * @param {string} patientID - The ID of the patient to update
   * @param {string} name - The new name of the patient
   * @param {string} surname - The new surname of the patient
   * @param {string} address - The new address of the patient
   * @param {string} birthdate - The new birthdate of the patient
   * @param {string} fiscalCode - The new fiscal code of the patient
   * @returns {Promise<Object>} The updated patient object
   * @throws Will throw an error if there are no patients in the ledger or if the patient with the given ID does not exist
   */
  async UpdateInfo(ctx, patientID, name, surname, address, birthdate, fiscalCode) {
    const serializedPatients = await ctx.stub.getState('patients');
    if (!serializedPatients || serializedPatients.length === 0) {
      throw new Error(`There are no patients in the ledger`);
    }
    const patients = JSON.parse(serializedPatients.toString());
    console.log("***patients: ", patients);
    const index = patients.findIndex(patient => patient.ID === patientID);
    if (index === -1) {
      throw new Error(`Patient with ID ${patientID} does not exist`);
    }

    const patient = patients[index];
    patient.Name = name;
    patient.Surname = surname;
    patient.Address = address;
    patient.BirthDate = birthdate;
    patient.CodiceFiscale = fiscalCode;
    patients[index] = patient;
    await ctx.stub.putState('patients', Buffer.from(stringify(sortKeysRecursive(patients))));
    console.log("***patient: ", patient);
    return patient;
  }

  /**
 * Put the patient in the state.
 * @param {Context} ctx - The transaction context object.
 * @param {object} user - The user object with all properties but password.
 * @returns {Promise<Object>} The patient object.
 * @throws Will throw an error if there is already a doctor with this uuid.
 */
  async PutUser(ctx, user) {
    user = JSON.parse(user);
    console.log("try to insert in the ledger:");
    console.log(user);
    const serializedPatients = await ctx.stub.getState('patients');
    const patients = JSON.parse(serializedPatients.toString());

    const exists = patients.find(patient => patient.ID === user.ID)
    if(exists) {
      throw new Error(`Patients already exist`);
    }

    // remove password attribute if exists
    delete user.password;
    // put new user
    patients.push(user);
    console.log(patients);
    await ctx.stub.putState('patients', Buffer.from(stringify(sortKeysRecursive(patients))));
    console.log("Successfully added new user.")
    return user;
  }
}

module.exports = PatientContract;