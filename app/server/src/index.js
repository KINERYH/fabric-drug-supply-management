const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const drugsRouter = require("./routes/drugs.routes");
const usersRouter = require("./routes/users.routes");
const testRouter = require("./routes/test.routes");
const auth = require("./utils/blockchain/authentication");
const { chaincodeName, channelName } = require("./config/blockchain");
const ledger = require("./utils/blockchain/connection");

async function main() {
  const { ccp, caClient, wallet } = await auth.setupBlockchainApplicationConfig();
  
  if (process.env?.INIT_LEDGER){
    await init_ledger(ccp, wallet, 'admin');
  }

  // Serves React frontend static files from 'build' directory
  app.use(express.static(path.join(__dirname, "../../client/build")));

  
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
  
  app.get("/api", (req, res) => {
      res.json({ message: "Hello from server!" });
  });
  
  app.use(express.json());
  app.use("/api/drugs", drugsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/test", testRouter);
  
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

  return { ccp, caClient, wallet };
};

// Chiamo la funzione main() e gestisco le promesse
main()
  .then((result) => {
    // Esporta result (che contiene ccp, caClient e wallet)
    // esportando ...result sto esportando { result.ccp, result.caClient, result.wallet}
    module.exports = { ...result };
  })
  .catch((error) => {
    console.error(`Failed to startup the server: ${error}`);
  });

async function init_ledger(ccp, wallet, adminId) {
  console.log('Inizializing the ledger ...');
  
  // Reading the initLedger json file
  const initState = require('./utils/initLedger.json');

  // Connect to the ledger
  const { gateway, contract } = await ledger.connect(ccp, wallet, adminId, channelName, chaincodeName);
  
  // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
  // This type of transaction would only be run once by an application the first time it was started after it
  // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
  // an "init" type function.

  console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
  await contract.submitTransaction('InitLedger', JSON.stringify(initState));
  console.log('*** Result: committed');

  ledger.disconnect(gateway);
  
  console.log('Ledger inizialized ...');
}