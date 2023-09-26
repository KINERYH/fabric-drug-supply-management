const auth = require("../utils/blockchain/authentication");
const db = require('../database/db.json');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');


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
    console.error('Failed to get user: ' + username + '\n' + error);
    throw Error(error);
  }

}

const loginUser = async (user) => {
  try{
    const userId = await db.users.find((u) => u.username === user.username);
    if (!userId) {
      throw Error("User " + user.username + " does not exist.");
    }
    const password = await db.users.find((u) => u.password === user.password);
    if (!password) {
      throw Error("Wrong password.");
    }

  } catch(error){
    console.error('Failed to login user: ' + user.username + '\n' + error);
    throw Error(error);
  }
};


const createUser = async (user) => {
  try{ 
    const userId = await db.users.find((u) => u.username === user.username);
    if (userId) {
      throw Error("User already exists.");
    }
    const uuid =  uuidv4();
    const newUser = {"username": user.username, "password": user.password, "role": "patient", "uuid": uuid};
    db.users.push(newUser);
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db));
    return await auth.registerUser(uuid);
  }
  catch(error){
    console.error('Failed to register user: ' + user.username);
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
  deleteUser,
  loginUser
};