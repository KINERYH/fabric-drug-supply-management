const express = require("express");
const router = express.Router();
require('dotenv').config();
const auth = require("../utils/blockchain/authentication");
const fs = require("fs");
const salt = process.env.BCRYPT_SALT;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const ledger = require("../utils/blockchain/connection");
const { chaincodeName, channelName } = require("../config/blockchain");

router.post("/", (async (req, res) => {
  const db = require('../database/db.json');
  const uuid = uuidv4();
  const { ccp, wallet } = require("../index");
  try{

    if (!req.body.email) {
      throw { status: 400, message: "Missing email."};
    }

    if (!req.body.password) {
      throw { status: 400, message: "Missing password."};
    }

    const userDb = db.users.find((u) => u.email === req.body.email);
    if (userDb) {
      throw { status: 400, message: "User already exists."};
    }

    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(salt));

    const newUser = {
      "email": req.body.email,
      "password": hashedPassword,
      "role": req.body.role,
      "uuid": uuid,
      "smartContract": req.body.role.concat("Contract")
    };
    console.log(newUser);
    db.users.push(newUser);
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db, null, 2));
    //register and enroll user
    await auth.registerUser(uuid);
    //connect to the ledger getting his smart contract
    const { gateway, contract } = await ledger.connect(ccp, wallet, uuid, channelName, chaincodeName, "AdminContract");


    // DRY

    // if(req.body.role === "Doctor"){
    //   const newUserLedger = {
    //     "ID": uuid,
    //     "CodiceFiscale" : req.body?.cf || '',
    //     "Name": req.body?.name || '',
    //     "Surname": req.body?.surname || '',
    //     "Specialization": req.body?.specialization || '',
    //     "Hospital": req.body?.hospital || ''
    //   }
    //   await contract.submitTransaction('CreateDoctor', JSON.stringify(newUserLedger));
    // } else if(req.body.role === "Manufacturer"){
    //   const newUserLedger = {
    //     "ID": uuid,
    //     "Name": req.body?.name || '',
    //     "Address": req.body?.address || '',
    //     "Drugs": []
    //   }
    //   await contract.submitTransaction('CreateManufacturer', JSON.stringify(newUserLedger));
    // } else if(req.body.role === "Pharmacy"){
    //   const newUserLedger = {
    //     "ID": uuid,
    //     "Name": req.body?.name || '',
    //     "Address": req.body?.address || '',
    //     "DrugStorage": []
    //   }
    //   await contract.submitTransaction('CreatePharmacy', JSON.stringify(newUserLedger));
    // }

    // ------------

    const roles = {
      "Doctor": {
        fields: ["CodiceFiscale", "Name", "Surname", "Specialization", "Hospital"],
        transaction: "CreateDoctor",
      },
      "Manufacturer": {
        fields: ["Name", "Address", "Drugs"],
        transaction: "CreateManufacturer",
      },
      "Pharmacy": {
        fields: ["Name", "Address", "DrugStorage"],
        transaction: "CreatePharmacy",
      },
    };
    
    const role = req.body.role;
    const roleInfo = roles[role];
    if (!roleInfo) {
      throw { status: 400, message: "Invalid role." };
    }
    
    const newUserLedger = {
      "ID": uuid,
    };
    
    for (const field of roleInfo.fields) {
      newUserLedger[field] = req.body[field] || '';
    }
    
    console.log(`\n--> Submit Transaction: ${roleInfo.transaction}`);
    await contract.submitTransaction(roleInfo.transaction, JSON.stringify(newUserLedger));
    console.log('*** Result: committed');

    // ------------

    ledger.disconnect(gateway);

    res.status(201).json({
      message: "New user created.",
      data: JSON.parse(JSON.stringify(newUserLedger))
    });

  } catch(error){
    console.error('Failed to register user: ' + req.body.name + ' '+ req.body.surname + '\n' + error?.message);
    console.error(error);
    delete db.users[db.users.indexOf(uuid)];
    fs.writeFileSync("./src/database/db.json", JSON.stringify(db, null, 2));
    res.status(error?.status || 500).json({
      message: "User not created.",
      error: error?.message || error
    });
  }
}));


module.exports = router;