const getAllDrugs = async () => {
  // Let's try a query type operation (function).
  // This will be sent to just one peer and the results will be shown.
  console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
  let result = await contract.evaluateTransaction('GetAllAssets');
  console.log(`*** Result: ${prettyJSONString(result.toString())}`);
  return;
};

const getOneDrug = () => {
  return;
};

const createNewDrug = () => {
  return;
};

const updateOneDrug = () => {
  return;
};

const deleteOneDrug = () => {
  return;
};

module.exports = {
  getAllDrugs,
  getOneDrug,
  createNewDrug,
  updateOneDrug,
  deleteOneDrug
};