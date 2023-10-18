require('dotenv').config();
const auth = require("../utils/blockchain/authentication");
const fs = require("fs");
const path = require('path');
const salt = process.env.BCRYPT_SALT;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const authMid = require("../middlewares/auth.middleware");
const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");



const getAllUsers = async () => {
  return;
};

const getUser = async (userId, currentUser) => {
  const db = require('../database/db.json');
  const { ccp, wallet } = require("../index");
  const user = await db.users.find((u) => u.uuid === userId);
  try {
    if (!user) {
      throw { status: 404, message: "User with id " + userId + " does not exist."};
    }
    const userWallet = fs.readdirSync(path.resolve(__dirname, '../config/wallet')).find((w) => w.includes(userId));
    if (!userWallet) {
      throw { status: 404, message: "Wallet not found."};
    }
    //connect to the ledger getting his smart contract
    const { gateway, contract } = await ledger.connect(ccp, wallet, currentUser.uuid, channelName, chaincodeName, currentUser.smartContract);
    console.log('\n--> Evaluate Transaction: GetUser');
    const result = await contract.evaluateTransaction('GetAllInfo', userId);
    ledger.disconnect(gateway);
    const userInfo = JSON.parse(result.toString());
    // const userInfo = { username: user.username, role: user.role, uuid: user.uuid };
    console.log(`\n--> User info correctly retrieved`);
    return userInfo;
  } catch (error) {
    console.error('Failed to get user: ' + user.username + '\n' + error?.message);
    throw error;
  }
}

const loginUser = async (userReq) => {
  try {
    const db = require('../database/db.json');
    console.log("Try to login user: " + userReq.username);
    const userDb = await db.users.find((u) => u.username === userReq.username);
    if (!userDb) {
      throw { status: 401, message: "User " + userReq.username + " does not exist."};
    }
    
    const matched = await new Promise((resolve, reject) => {
      bcrypt.compare(userReq.password, userDb.password, (err, result) => {
        (err) ? reject(err) : resolve(result);
      });
    }).catch((error) => {
      // Questo blocco verrà eseguito solo se la Promessa viene rigettata
      console.error('Failed to compare password: ', error);
      throw { status: 503, message: "Failed to compare password."};
    });
    console.log("Password match: " + matched);
    if (matched) {
      return authMid.releaseToken({ 
        uuid: userDb.uuid,
        username: userReq.username, 
        role: userDb.role, 
        smartContract: userDb.smartContract 
      });
    } else {
      throw { status: 401, message: "Wrong credentials."};
    }
  } catch (error) {
    console.error('Failed to login user: ' + userReq.username + '\n  ' + error.message);
    throw (error);
  }
};


const createUser = async (user) => {
  const db = require('../database/db.json');
  const uuid = uuidv4();
  try {
    const { ccp, wallet } = require("../index");
    
    console.log(user);
    if (!user.username) {
      throw { status: 400, message: "Missing username."};
    }
    if (!user.password) {
      throw { status: 400, message: "Missing password."};
    }
    const userDb = await db.users.find((u) => u.username === user.username);
    if (userDb) {
      throw { status: 400, message: "User already exists."};
    }

    const hashedPassword = await bcrypt.hash(user.password, parseInt(salt));
    console.log("Hashed password: " + hashedPassword);
    const newUser = {
      "username": user.username,
      "password": hashedPassword,
      "role": user.role,
      "uuid": uuid,
      "smartContract": user.role.concat("Contract")
    };
    console.log(newUser);
    db.users.push(newUser);
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db, null, 2));
    //register and enroll user
    await auth.registerUser(uuid);
    //connect to the ledger getting his smart contract
    const { gateway, contract } = await ledger.connect(ccp, wallet, uuid, channelName, chaincodeName, newUser.smartContract);
    //register user in the state
    let newUserLedger = {
      "Name": user.username,
      "Surname": user?.surname || '',
      "ID": uuid,
      "Address": user?.address || '',
      "Allergies": user?.allergies || [],
      "BirthDate": user?.birthDate || '',
      "CodiceFiscale": user?.cf || '',
      "MedicalHistory": user?.medicalHistory || [],
      "Height": user?.height || '',
      "Weight": user?.weight || ''
    };
    console.log('\n--> Submit Transaction: PutUser');
    newUserLedger = await contract.submitTransaction('PutUser', JSON.stringify(newUserLedger));
    console.log('*** Result: committed');
    ledger.disconnect(gateway);
    newUserLedger = JSON.parse(newUserLedger.toString());
    return newUserLedger;
  } catch (error) {
    console.error('Failed to register user: ' + user.username);
    console.error(error);
    delete db.users[db.users.indexOf(uuid)];
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db, null, 2));
    throw error;
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