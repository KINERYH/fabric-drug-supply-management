const auth = require("../utils/blockchain/authentication");

const getAllUsers = async () => {
  return;
};

const getUser = () => {
  return;
};

const createUser = async (userId) => {
  try{ 
    return await auth.registerUser(userId);
  } catch(error) {
    console.error(error);
    throw Error(error);
  }
};

const updateUser = () => {
  return;
};

const deleteUser = () => {
  return;
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};