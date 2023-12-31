const path = require('path');
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

module.exports = {
  channelName,
  chaincodeName,
  mspOrg1,
  walletPath,
  org1UserId
};