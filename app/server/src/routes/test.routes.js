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

module.exports = router;