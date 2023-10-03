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
	const storage = JSON.parse(result.toString());
	console.log('*** List:', JSON.stringify(storage, null, 2));
	res.json({ status: "OK", data: storage });
});

module.exports = router;
