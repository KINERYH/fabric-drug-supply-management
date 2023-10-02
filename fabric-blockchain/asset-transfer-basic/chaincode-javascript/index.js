/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const docContract = require('./lib/docContract');

module.exports.AssetTransfer = assetTransfer;
module.exports.contracts = [assetTransfer, docContract];
module.exports.DocContract = docContract;
