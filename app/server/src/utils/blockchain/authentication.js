/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
// ============== ASE modifica dovuta a cambiamento di percorso dei file AppUtil.js ===============
// const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
// const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const { mspOrg1, walletPath } = require("../../config/blockchain.js");

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

exports.registerUser = async (org1UserId) => {
	try {
    console.log(org1UserId);
    const { caClient, wallet } = require("../../index.js");
		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		return await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
	} catch (error) {
		console.error(`******** FAILED to register: ${error}`);
		throw Error(error);
	}
};

exports.setupBlockchainApplicationConfig = async () => {
  // build an in memory object with the network configuration (also known as a connection profile)
  const ccp = buildCCPOrg1();

  // build an instance of the fabric ca services client based on
  // the information in the network configuration
  const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

  // setup the wallet to hold the credentials of the application user
  const wallet = await buildWallet(Wallets, walletPath);

  // in a real application this would be done on an administrative flow, and only once
  await enrollAdmin(caClient, wallet, mspOrg1);

  return { ccp, caClient, wallet };
};
