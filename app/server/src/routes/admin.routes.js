const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

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

router.post("/", (async (req, res) => {
  try{
    const db = require('../database/db.json');
    const uuid = uuidv4();
    const { ccp, wallet } = require("../index");

    if (!req.body.cf) {
      throw { status: 400, message: "Missing codice fiscale."};
    }

    //TODO: refactorizzare quando si passa a fare il login con la mail
    const userDb = db.users.find((u) => u.cf === user.cf);
    if (userDb) {
      throw { status: 400, message: "User already exists."};
    }

    let role = null;
    let newUser = null;

    //TODO: finire di checkare lo uuid e il resto della funzione da "users.service"

    if(req.body.role === "Doctor"){
      role = "Doctor";
      newUser = {
        "ID": uuid,
        "CodiceFiscale" : req.body.cf,
        "Name": req.body?.name || '',
        "Surname": req.body?.surname || '',
        "Specialization": req.body?.specialization || '',
        "Hospital": req.body?.hospital || ''
      }
    } else if(req.body.role === "Manufacturer"){
      role = "Manufacturer";
      newUser = {
        "CodiceFiscale" : req.body.cf,
        "ID": ,
        "Name": "manufacturer1",
        "Address": "address1",
        "Drugs": ""
      }
    } else if(req.body.role === "Pharmacy"){
      role = "Pharmacy";
    }

    if(role === null){
      throw { status: 400, message: "Invalid role."};
    }



    res.status(201).json({
      message: "New user created.",
      data: createdUser
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "User not created.",
      error: error?.message || error
    });
  }
}));


module.exports = router;