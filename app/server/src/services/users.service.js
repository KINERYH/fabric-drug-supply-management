const auth = require("../utils/blockchain/authentication");

const getAllUsers = async () => {
  return;
};

const getUser = () => {
  return;
};

const createUser = async (userId) => {
  return await auth.registerUser(userId);
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