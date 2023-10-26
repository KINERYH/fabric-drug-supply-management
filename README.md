# fabric-drug-supply-management

This application represents a comprehensive solution for tracking the entire pharmaceutical supply chain using blockchain technology. It leverages the HyperLedger Fabric framework to ensure the secure recording of drug supply chain data. Its primary objective is to address pharmaceutical supply chain safety concerns by facilitating drug record transactions on a blockchain, thereby establishing a smart healthcare ecosystem.

## Prerequisites
- Docker
- Node.js
- HyperLedger Fabric

Refer to https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html

## Setting up the Network and the Application

Follow these steps to set up the network:

1. Change the working directory to `fabric-blockchain/test-network`:

   ```bash
   cd fabric-blockchain/test-network
   ```
     
2. Down the existing network
  
    ```bash
    ./network.sh down
    ```

3. Run the test network infrastructure

    ```bash
    ./network.sh up createChannel -ca
    ```

4. Deploy the asset-transfer-basic chaincode

   ```bash
    ./network.sh deployCC -ccn basic -ccv 1.0 -ccs 1 -ccp ../asset-transfer-basic/chaincode-javascript -ccl javascript
    ```

6. Install node modules

   ```bash
    cd ../../app/server 
    npm install
    ```

7. Run the application initializing the ledger

   ```bash
    npm run start-init
    ```

8. Start the frontend server

   ```bash
    cd ../../app/client
    npm install
    npm start 
    ```

Please note that the command `npm run start-init` overwrites the current WorldState, with the one contained in the file `initLedger.json`.<br />
<br />
To start the application without initializing the ledger again, you can use the simple `npm start`<br />
<br />
**In case of network reboot** it is necessary to delete the `wallet` folder (`app/server/src/config/wallet`) before running the application.

