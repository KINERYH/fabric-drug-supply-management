'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class DoctorContract extends Contract {

  //TODO: questa va tolta e va creata una admin route per aggiungere gli utenti che non siano patients, utilizzando l'admin contract
  async PutUser(ctx, user) {
    user = JSON.parse(user);
    console.log("try to insert in the ledger:");
    console.log(user);
    const serializedDoctors = await ctx.stub.getState('doctors');
    const doctors = JSON.parse(serializedDoctors.toString());

    const exists = doctors.find(doc => doc.ID === user.ID)
    if(exists) {
      throw new Error(`Patients already exist`);
    }
    // remove password attribute if exists
    delete user.password;
    // put new user
    doctors.push(user);
    console.log(doctors);
    await ctx.stub.putState('doctors', Buffer.from(stringify(sortKeysRecursive(doctors))));
    console.log("Successfully added new doctor.")
    return user;
  }

  async GetAllInfo(ctx, docID) {
    const serializedDoctors = await ctx.stub.getState('doctors');
    if (!serializedDoctors || serializedDoctors.length === 0) {
      throw new Error(`There are no doctors in the ledger`);
    }
    const doctors = JSON.parse(serializedDoctors.toString());
    const doctor = doctors.find(doctor => doctor.ID === docID);
    return doctor;
  }

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

  /**
   * Check if a doctor exists.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} doctorID - The ID of the doctor to check.
   * @returns {boolean} - True or False.
   * @throws Will throw an error if a doctor does not exist.
   */
  async DoctorExists(ctx, doctorID) {
    const doctors = await ctx.stub.getState('doctors');
    if (!doctors || doctors.length === 0) {
      throw new Error(`No doctors in the ledger`);
    }
    const exists = doctors.find(doctor => doctor.ID === doctorID)
    return exists;
  }

  /**
   * Check if a patient exists.
   * @async
   * @param {Context} ctx - The transaction context object.
   * @param {string} patientID - The ID of the patient to check.
   * @returns {boolean} - True or False.
   * @throws Will throw an error if a patient does not exist.
   */
  async PatientExists(ctx, patientID) {
    const patients = await ctx.stub.getState('patients');
    if (!patients || patients.length === 0) {
      throw new Error(`No patients in the ledger`);
    }
    const exists = patients.find(patient => patient.ID === patientID)
    return exists;
  }


  /**
   * Creates a new prescription for a patient by a doctor.
   * @async
   * @function CreatePrescription
   * @param {Context} ctx - The transaction context object
   * @param {string} docID - The ID of the doctor creating the prescription
   * @param {string} patientID - The ID of the patient for whom the prescription is being created
   * @param {string} drugs - The drugs prescribed, in JSON format
   * @param {string} description - The description of the prescription
   * @returns {Promise<Object[]>} - the new prescription
   * @throws {Error} - If the doctor or patient does not exist or if the patient is allergic to any of the drugs
   */
  async CreatePrescription(ctx, docID, patientCF, prescriptionID, drugs, description) {

    const serializedPrescriptionsList = await ctx.stub.getState('prescriptions');
    const prescriptionsList = JSON.parse(serializedPrescriptionsList.toString());

    // Get allergies of the patient
    const serializedPatients = await ctx.stub.getState('patients');
    const patients = JSON.parse(serializedPatients.toString());
    const patient = patients.find(patient => patient.CodiceFiscale === patientCF);
    if(!patient){
      throw new Error(`Patient with CF = ${patientCF} does not exist`);
    }
    const patientID = patient.ID;
    const allergies = patient.Allergies;

    const serializedDrugs = await ctx.stub.getState('drugs');
    const ledgerDrugs = JSON.parse(serializedDrugs.toString());
    for(let drug of JSON.parse(drugs)){
      console.log("***CONTRACT - DRUG_ID = " + drug.DrugID + " - DRUG_QUANTITY = " + drug.Quantity);
      const ledgerDrug = ledgerDrugs.find(d => d.DrugID === drug.DrugID);
      if(!ledgerDrug){
        throw new Error(`Drug ${drug.DrugID} does not exist`);
      }
      const composition = ledgerDrug.Composition;
      for(let component of composition){
        if(allergies.includes(component)){
          throw new Error(`Patient ${patient.Name} ${patient.Surname} is allergic to the component ${component} of the drug ${drug.Name}`);
        }
      }
    }

    const prescription = {
      ID: prescriptionID,
      DoctorID: docID,
      PatientID: patientID,
      Drugs: JSON.parse(drugs),
      Description: description,
      Status: "pending",
      PharmacyID: null,
      ProcessingDate: null
    };
    console.log(drugs)
    prescriptionsList.push(prescription)
    console.log(prescriptionsList)
    console.log(prescription)
    await ctx.stub.putState('prescriptions', Buffer.from(stringify(sortKeysRecursive(prescriptionsList))));

    return prescription;
  }

  /**
   * Retrieves all patients from the ledger.
   * @async
   * @function
   * @param {Context} ctx - The transaction context object.
   * @returns {Promise<Array>} - An array of patient objects.
   * @throws {Error} - If there are no patients in the ledger.
   */
  async GetAllPatients(ctx) {
    const serializedPatients = await ctx.stub.getState('patients');
    if (!serializedPatients || serializedPatients.length === 0) {
      throw new Error(`There are no patients in the ledger`);
    }
    const patients = JSON.parse(serializedPatients.toString());
    return patients;
  }


  /**
   * Retrieves a patient from the ledger by their ID.
   * @async
   * @function
   * @param {Context} ctx - The transaction context object.
   * @param {string} patientID - The ID of the patient to retrieve.
   * @returns {Promise<Object>} The patient object.
   * @throws Will throw an error if there are no patients in the ledger or if the specified patient does not exist.
   */
  async GetPatient(ctx, patientID) {
    const serializedPatients = await ctx.stub.getState('patients');
    if (!serializedPatients || serializedPatients.length === 0) {
      throw new Error(`There are no patients in the ledger`);
    }
    const patientExists = await this.PatientExists(ctx, patientID);
    if(patientExists == false) {
      throw new Error(`Patient does not exist`);
    }
    const patients = JSON.parse(serializedPatients.toString());
    const patient = patients.find(patient => patient.ID === patientID);
    return patient;
  }

  /**
   * Updates the medical history of a specific patient.
   * @param {Context} ctx - The transaction context object.
   * @param {string} patientID - The ID of the patient to retrieve.
   * @param {string} newMedHistory - The new medical history to add.
   * @returns {Promise<Object>} The patient object.
   * @throws Will throw an error if there are no patients in the ledger or if the specified patient does not exist.
   */
  async UpdatePatientMedHistory(ctx, patientID, newMedHistory) {
    const serializedPatients = await ctx.stub.getState('patients');
    if (!serializedPatients || serializedPatients.length === 0) {
      throw new Error(`There are no patients in the ledger`);
    }
    const patientExists = await this.PatientExists(ctx, patientID);
    if(patientExists == false) {
      throw new Error(`Patient does not exist`);
    }
    const patients = JSON.parse(serializedPatients.toString());
    const patient = patients.find(patient => patient.ID === patientID);
    let medHist = patient.MedicalHistory;
    medHist.push(newMedHistory);
    patient.MedicalHistory = medHist;
    await ctx.stub.putState('patients', Buffer.from(stringify(sortKeysRecursive(patients))));
    return patient.MedicalHistory;
  }

  async GetAllDrugs(ctx) {
    const serializedDrugs = await ctx.stub.getState('drugs');
    if (!serializedDrugs || serializedDrugs.length === 0) {
      throw new Error(`There are no drugs in the ledger`);
    }
    const drugs = JSON.parse(serializedDrugs.toString());
    return drugs;  
  }

}


module.exports = DoctorContract;