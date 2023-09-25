const auth = require("../utils/blockchain/authentication");
const creds = require("../database/credentials");

const getAllUsers = async () => {
  return;
};

const getUser = async (user) => {
  try{
    return await creds.getUser(user);
  } catch(error){
    console.error(error);
    throw Error(error);
  }
};

const createUser = async (user) => {
  try{
    return await creds.registerUser(user);
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