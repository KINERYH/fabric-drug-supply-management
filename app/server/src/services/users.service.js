const auth = require("../utils/blockchain/authentication");
const creds = require("../database/credentials");
const db = require("../database/db.json");
const fs = require("fs");
const path = require('path');


const getAllUsers = async () => {
  return;
};

const getUser = async (username) => {
  try{
    const user = await db.users.find((u) => u.username === username);
    if (!user) {
      throw Error("User " + username + " does not exist.");
    }
    const uuid = user.uuid;
    // TODO: correggi path
    const wallet = fs.readdirSync(path.resolve(__dirname, '../config/wallet')).find((w) => w.includes(uuid));
    if (!wallet) {
      throw Error("Wallet not found.");
    }
    const user_info = {"username": user.username, "role": user.role, "UUID": user.uuid};
    console.log(`\n--> User info correctly retrieved`);
    return  user_info;
  } catch(error){
    console.error('Failed to get user: ' + username);
    throw Error(error);
  }

}

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