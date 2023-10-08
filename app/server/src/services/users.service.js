require('dotenv').config();
const auth = require("../utils/blockchain/authentication");
const fs = require("fs");
const path = require('path');
const salt = process.env.BCRYPT_SALT;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const authMid = require("../middlewares/auth.middleware");



const getAllUsers = async () => {
  return;
};

const getUser = async (userId) => {
  const db = require('../database/db.json');
  const user = await db.users.find((u) => u.uuid === userId);
  try {
    if (!user) {
      throw { status: 404, message: "User with id " + userId + " does not exist."};
    }
    const wallet = fs.readdirSync(path.resolve(__dirname, '../config/wallet')).find((w) => w.includes(userId));
    if (!wallet) {
      throw { status: 404, message: "Wallet not found."};
    }
    const userInfo = { username: user.username, role: user.role, uuid: user.uuid };
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
  try {
    console.log(user);
    if (!user.username) {
      throw Error("Missing username.");
    }
    if (!user.password) {
      throw Error("Missing password.");
    }
    const userDb = await db.users.find((u) => u.username === user.username);
    if (userDb) {
      throw Error("User already exists.");
    }

    const uuid = uuidv4();
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
    await auth.registerUser(uuid);
    return newUser;
  } catch (error) {
    console.error('Failed to register user: ' + user.username + '\n' + error);
    delete db.users[db.users.indexOf(uuid)];
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db, null, 2));
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