/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const doctorContract = require('./lib/doctorContract');
const pharmacyContract = require('./lib/pharmacyContract');

module.exports.AssetTransfer = assetTransfer;
module.exports.DoctorContract = doctorContract;
module.exports.PharmacyContract = pharmacyContract;
module.exports.contracts = [assetTransfer, doctorContract, pharmacyContract];
