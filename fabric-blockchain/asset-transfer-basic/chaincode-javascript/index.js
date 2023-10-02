/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const doctorContract = require('./lib/doctorContract');

module.exports.AssetTransfer = assetTransfer;
module.exports.DoctorContract = doctorContract;
module.exports.contracts = [assetTransfer, doctorContract];
