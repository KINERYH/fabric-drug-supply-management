/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx, initState) {
        initState = JSON.parse(initState);
        await ctx.stub.putState('drugs', Buffer.from(stringify(sortKeysRecursive(initState.drugs))));
        await ctx.stub.putState('prescriptions', Buffer.from(stringify(sortKeysRecursive(initState.prescriptions))));
        await ctx.stub.putState('orders', Buffer.from(stringify(sortKeysRecursive(initState.orders))));
        await ctx.stub.putState('doctors', Buffer.from(stringify(sortKeysRecursive(initState.doctors))));
        await ctx.stub.putState('patients', Buffer.from(stringify(sortKeysRecursive(initState.patients))));
        await ctx.stub.putState('pharmacies', Buffer.from(stringify(sortKeysRecursive(initState.pharmacies))));
        await ctx.stub.putState('manufacturer', Buffer.from(stringify(sortKeysRecursive(initState.manufacturers))));
        // for (const asset of assets) {
        //     asset.docType = 'asset';
        //     // example of how to write to world state deterministically
        //     // use convetion of alphabetic order
        //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        //     // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
        //     await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        // }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const stateData = {};
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            // Extract the data type from the key.
            // Ex: result.value.key => "drugs:ec110aef-28ce-4d1b-a008-840e40390328"
            const key = result.value.key.toString('utf8');
            const dataType = key.split(':')[0]; // dataType = "drugs"

            // If the data type doesn't exist in the stateData object, initialize it as an empty array.
            if (!stateData[dataType]) {
                stateData[dataType] = [];
            }

            // Add the record to the corresponding array.
            stateData[dataType].push(record);

            result = await iterator.next();
        }

        return JSON.stringify(stateData);
    }



}

module.exports = AssetTransfer;
