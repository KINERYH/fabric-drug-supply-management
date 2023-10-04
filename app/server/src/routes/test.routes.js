const express = require("express");
const router = express.Router();


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
	console.log(typeof(req.body.PatientID), typeof(req.body.DoctorID), typeof(req.body.Drugs), typeof(req.body.Description));
	const { contract } = await ledger.connect(ccp, wallet, 'admin', channelName, chaincodeName, 'DoctorContract');
	//async CreatePrescription(ctx, docID, patientID, drugs, description) {
	const result = await contract.submitTransaction('CreatePrescription', req.body.DoctorID, req.body.PatientID, req.body.Drugs, req.body.Description);
	res.json({ status: "OK", data: result });
});



module.exports = router;
