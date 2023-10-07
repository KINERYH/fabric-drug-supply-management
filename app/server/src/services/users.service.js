const auth = require("../utils/blockchain/authentication");
const db = require('../database/db.json');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const authMid = require("../middlewares/auth.middleware");



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
    //const wallet = fs.readdirSync(path.resolve(__dirname, '../config/wallet')).find((w) => w.includes(uuid));
    //if (!wallet) {
    //  throw Error("Wallet not found.");
    //}
    const user_info = {"username": user.username, "role": user.role, "UUID": user.uuid};
    console.log(`\n--> User info correctly retrieved`);
    return  user_info;
  } catch(error){
    console.error('Failed to get user: ' + username + '\n' + error);
    throw Error(error);
  }

}

const loginUser = async (userReq) => {
  try{
    const userDb = await db.users.find((u) => u.username === userReq.username);
    if (!userDb) {
      throw Error("User " + userReq.username + " does not exist.");
    }
    if (await !(bcrypt.compare(userReq.password, userDb.password))){
      throw Error("Wrong password.");
    } else {
      return authMid.releaseToken({username: userReq.username, role: userDb.role});
    }
  } catch(error){
    console.error('Failed to login user: ' + userReq.username + '\n' + error);
    throw Error(error);
  }
};


const createUser = async (user) => {
  try{
    if (!user.username) {
      throw Error("Missing username.");
    }
    if (!user.password) {
      throw Error("Missing password.");
    }

    const userId = await db.users.find((u) => u.username === user.username);
    if (userId) {
      throw Error("User already exists.");
    }
    const uuid =  uuidv4();
    const newUser = {"username": user.username, "password": user.password, "role": "patient", "uuid": uuid};
    db.users.push(newUser);
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db));
    // TODO: cerca di capire perché la funzione da errore
    // return await auth.registerUser(uuid);
    return newUser;
  }
  catch(error){
    console.error('Failed to register user: ' + user.username);
    delete db.users[db.users.indexOf(uuid)];
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