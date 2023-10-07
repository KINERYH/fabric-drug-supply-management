const { Gateway, Wallets } = require('fabric-network');

//TODO: aggiunta possibilità di indigare un contratto, in realtà questo potrebbe essere indicato nella variabile orgUserID
exports.connect = async (ccp, wallet, org1UserId, channelName, chaincodeName, contractName = 'AssetTransfer') => {
  // Create a new gateway instance for interacting with the fabric network.
  // In a real application this would be done as the backend server session is setup for
  // a user that has been verified.
  const gateway = new Gateway();

  // setup the gateway instance
  // The user will now be able to create connections to the fabric network and be able to
  // submit transactions and query. All transactions submitted by this gateway will be
  // signed by this user using the credentials stored in the wallet.
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
  });

  // Build a network instance based on the channel where the smart contract is deployed
  const network = await gateway.getNetwork(channelName);

  // Get the contract from the network.
  const contract = network.getContract(chaincodeName, contractName);

  return { gateway, contract };
};

exports.disconnect = (gateway) => {
  // Disconnect from the gateway when the application is closing
  // This will close all connections to the network
  gateway.disconnect();
};