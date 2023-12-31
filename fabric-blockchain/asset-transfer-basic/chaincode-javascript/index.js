/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const doctorContract = require('./lib/doctorContract');
const pharmacyContract = require('./lib/pharmacyContract');
const manufacturerContract = require('./lib/manufacturerContract');
const patientContract = require('./lib/patientContract');
const adminContract = require('./lib/adminContract');

module.exports.AssetTransfer = assetTransfer;
module.exports.DoctorContract = doctorContract;
module.exports.PharmacyContract = pharmacyContract;
module.exports.ManufacturerContract = manufacturerContract;
module.exports.PatientContract = patientContract;
module.exports.AdminContract = adminContract;
module.exports.contracts = [assetTransfer, doctorContract, pharmacyContract, manufacturerContract, patientContract, adminContract];
