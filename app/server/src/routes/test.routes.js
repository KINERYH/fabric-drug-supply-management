const express = require("express");
const router = express.Router();
const { v4: uuidv4, stringify } = require('uuid');


const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");

router.get("/", async (req, res) => {
	// If I remove this requirement from here and put it at the beginning of the script i get an error
	const { ccp, wallet } = require("../index");
	//TODO la connection non dovrebbe stare qui, deve essere collegate alla sessione utente
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName);

	const result = await contract.evaluateTransaction('GetAllAssets');
	const worldState = JSON.parse(result.toString());
	console.log("*** World State:", JSON.stringify(worldState, null, 2));
	res.json({ status: "OK", data: worldState });
});


router.get("/patients", async (req, res) => {
	const { ccp, wallet } = require("../index");
	// creo il contratto indicando il contratto docContract
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetAllPatients');
	const patients = JSON.parse(result.toString());
	console.log('*** Patients:', JSON.stringify(patients, null, 2));
	res.json({ status: "OK", data: patients });
});

// At the moment I'm testing here the PharmacyContract, later I'll move it to the correct route
// curl -X GET http://localhost:3001/api/test/pharmacy/94ae7246-40c6-40fa-8d5a-fcc34d0edbca
router.get("/pharmacy/:pharmacyID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'PharmacyContract');
	const result = await contract.evaluateTransaction('GetPharmacyStorage', req.params.pharmacyID);
	console.log("Result: \n",result);
	const storage = JSON.parse(result.toString());
	console.log('*** List:', JSON.stringify(storage, null, 2));
	res.json({ status: "OK", data: storage });
});


// curl -X GET http://localhost:3001/api/test/pharmacy/94ae7246-40c6-40fa-8d5a-fcc34d0edbca/quantity
router.get("/pharmacy/:pharmacyID/quantity", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'PharmacyContract');
	const result = await contract.evaluateTransaction('GetAllDrugs', req.params.pharmacyID);
	const map = JSON.parse(result.toString());
	console.log('*** List:', JSON.stringify(map, null, 2));
	res.json({ status: "OK", data: map });
});

// curl -X POST http://localhost:3001/api/test/prescriptions/6918bcdb-bf53-4a88-9f11-986b52a72fc4 -H "Content-Type: application/json" -d '{"pharmacyID":"94ae7246-40c6-40fa-8d5a-fcc34d0edbca"}'
router.post("/prescriptions/:prescriptionID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'PharmacyContract');
	await contract.submitTransaction('ProcessPrescription', req.params.prescriptionID, req.body.pharmacyID);
	// console.log(JSON.parse(result.toString()));
	res.json({ status: "OK", data: "Prescription processed successfully" });
});

// Test route per il DoctorContract
router.get("/doctors/prescription/:doctorID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetAllPrescriptions', req.params.doctorID);
	const doctor = JSON.parse(result.toString());
	res.json({ status: "OK", data: doctor });
});

router.get("/doctors/name/:doctorID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetName', req.params.doctorID);
	const name = result.toString();
	res.json({ status: "OK", data: name });
});

router.get("/doctors/surname/:doctorID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetSurname', req.params.doctorID);
	const surname = result.toString();
	res.json({ status: "OK", data: surname });
});

router.get("/doctors/hospital/:doctorID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetHospital', req.params.doctorID);
	const hospital = result.toString();
	res.json({ status: "OK", data: hospital });
});

router.get("/doctors/specialization/:doctorID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetSpecialization', req.params.doctorID);
	const specialization = result.toString();
	res.json({ status: "OK", data: specialization });
});

router.post("/doctors/prescriptions", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const docID = req.body.DoctorID;
	const patID = req.body.PatientID;
	// FONDAMENTALE: qualsiasi object va convertito in stringa per essere correttamente passato al chaincode
	const drugs = JSON.stringify(req.body.Drugs);
	const description = req.body.Description;
	// Il prescription id deve essere uguale tra i peer quindi va generato prima
	const prescID = uuidv4();
	const result = await contract.submitTransaction('CreatePrescription', docID, patID, prescID, drugs, description);
	const prescriptions = JSON.parse(result.toString());
	res.json({ status: "OK", data: prescriptions });
});

//JSON.parse(prescriptionsList.toString()
router.get("/doctors/patients", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetAllPatients');
	const patients = JSON.parse(result.toString());
	res.json({ status: "OK", data: patients });
});

router.get("/doctors/patients/:patientID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.evaluateTransaction('GetPatient', req.params.patientID);
	const patient = JSON.parse(result.toString());
	res.json({ status: "OK", data: patient });
});

router.post("/manufacturers/validate", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'ManufacturerContract');
	const order = await contract.evaluateTransaction('GetOrder', req.body.OrderID);
	const orderData = JSON.parse(order.toString());
	const drugsNumber = orderData.Drugs.length;
	let quantity = 0;
	for (let i = 0; i < drugsNumber; i++) {
		quantity += orderData.Drugs[i].Quantity;
	}
	// LA CREAZIONE DEGLI ID VA FATTA PER FORZA A LIVELLO APPLICATIVO PER GARANTIRE CHE SIANO UGUALI TRA I PEER
	const drugIDs = [];
	for (let i = 0; i < quantity; i++) {
		drugIDs.push(uuidv4());
	}
	const result = await contract.submitTransaction('ValidateOrder', req.body.OrderID, req.body.ManufacturerID, JSON.stringify(drugIDs));
	const orders = JSON.parse(result.toString());
	res.json({ status: "OK", data: orders });
	console.log("Orders: \n", orders);
});

router.get("/doctors/medhistory/:patientID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet,'admin', channelName, chaincodeName, 'DoctorContract');
	const result = await contract.submitTransaction('UpdatePatientMedHistory', req.params.patientID, 'provaUpdate');
	const medicalHistory = JSON.parse(result.toString());
	res.json({ status: "OK", data: medicalHistory });
	console.log("Medical History: \n", medicalHistory);
});

router.get("/patients/:patientID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'PatientContract');
	const result = await contract.evaluateTransaction('GetAllInfo', req.params.patientID);
	const patient = JSON.parse(result.toString());
	res.json({ status: "OK", data: patient });
});

router.post("/patients/update/:patientID", async (req, res) => {
	const { ccp, wallet } = require("../index");
	const { contract } = await ledger.connect(ccp, wallet,'admin', channelName, chaincodeName, 'PatientContract');
	const result = await contract.submitTransaction('UpdateInfo', req.params.patientID, req.body.Name, req.body.Surname, req.body.Address,  req.body.Birthdate,  req.body.CodiceFiscale);
	const patient = JSON.parse(result.toString());
	res.json({ status: "OK", data: patient });
	console.log("Patient: \n", patient);
});

router.post("/pharmacy/order/", async (req, res) => {
	const orderId = uuidv4();
	try{
	  const { ccp, wallet } = require("../index")
	  const { gateway, contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'PharmacyContract');
	  const drugs = JSON.stringify(req.body.Drugs);
		console.log(typeof(drugs))
		console.log(typeof(req.body.PharmacyID))
		console.log(typeof(orderId))
		console.log(typeof(req.body.ManufacturerID))
		console.log(typeof(req.body.Description))
	  const result = await contract.submitTransaction('RequestOrder', req.body.PharmacyID, orderId, req.body.ManufacturerID, drugs, req.body.Description);
	  const createdOrder = JSON.parse(result.toString());
	  ledger.disconnect(gateway);
	  console.log("*** Created order:", JSON.stringify(createdOrder, null, 2));
	  return createdOrder;
	}
	catch(error){
	  console.error('Failed to create order: ' + '\n' + error?.message);
	  throw error;}
})

module.exports = router;
