const db = require("./db.json");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const fs = require("fs");
const auth = require("../utils/blockchain/authentication");

const getAllUsers = () => {
  return db.users;
  // TODO: implementare la lettura da blockchain
};

const getUser = (userID) => {

}
const registerUser = async (user) => {
  console.log("User name: " + user.username);
  try{ const userId = await db.users.find((u) => u.username === user.username);
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


module.exports = {
  getAllUsers,
  registerUser};