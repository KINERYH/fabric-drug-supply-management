const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const drugsRouter = require("./routes/drugs.routes");
const usersRouter = require("./routes/users.routes");
const auth = require("./utils/blockchain/authentication");

async function main() {
  const { ccp, caClient, wallet } = await auth.setupBlockchainApplicationConfig();
  
  app.get("/api", (req, res) => {
      res.json({ message: "Hello from server!" });
  });
  
  app.use(express.json());
  app.use("/api/drugs", drugsRouter);
  app.use("/api/users", usersRouter);
  
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