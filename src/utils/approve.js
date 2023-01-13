import {checkAddress} from './tz.js';
import { TezosOperationType } from '@airgap/beacon-sdk'


export const schema = { "x-props": {"outlined": true, "dense": true}, "type": "object", "properties": { "allowances": { "x-props": {"outlined": true, "dense": true}, "type": "array", "prim": "list", "default": [], "items": { "x-props": {"outlined": true, "dense": true}, "type": "object", "required": ["token_type"], "properties": { "token_type": { "x-props": {"outlined": true, "dense": true}, "oneOf": [{ "title": "FA1.2", "properties": { "schema_key": { "type": "integer", "const": 1 }, "token_contract": { "x-props": {"outlined": true, "dense": true}, "type": "string", "title": "Token contract", "prim": "address", "default": "", "minLength": 36, "maxLength": 36 }, "allowance": { "x-props": {"outlined": true, "dense": true}, "type": "integer", "title": "Allowance", "prim": "nat", "default": 0 } } }, { "title": "FA2", "properties": { "schema_key": { "type": "integer", "const": 2 }, "token_contract": { "x-props": {"outlined": true, "dense": true}, "type": "string", "title": "Token contract", "prim": "address", "default": "", "minLength": 36, "maxLength": 36 }, "owner": { "x-props": {"outlined": true, "dense": true}, "type": "string", "title": "Owner", "prim": "address", "default": "", "minLength": 36, "maxLength": 36 }, "token_id": { "x-props": {"outlined": true, "dense": true}, "type": "integer", "title": "Token id", "prim": "nat", "default": 0 } } }], "title": "Token type", "prim": "or", "type": "object" } }, "x-options": { "sectionsClass": "pl-0" } } } } }

const approveEntrypoint = 'approve';
const updateOperatorsEntrypoint = "update_operators"

export function approveData(allowances, spender) {
    if (!checkAddress(spender)) {
        throw new Error(`invalid spender address: ${spender}`) 
    }

    let result = {
        fa1: {
            approves: [],
            revokes: []
        },
        fa2: {
            approves: [],
            revokes: []
        }
    }
    allowances.forEach(item => {
        let x = item.token_type;
        let typ = x.schema_key;

        if (!checkAddress(x.token_contract)) {
            throw new Error(`invalid token contract address: ${x.token_contract}`) 
        }

        if (typ == 1) {
            let body = processFa1(x, spender);
            result.fa1.approves.push(body[0]);
            result.fa1.revokes.push(body[1]);
        } else if (typ == 2) {
            let body = processFa2(x, spender);
            result.fa2.approves.push(body[0]);
            result.fa2.revokes.push(body[1]);
        }
    });

    return result;
}

function processFa1(item, spender) {
    if (!item.allowance || typeof item.allowance !== 'number') {
        throw new Error(`invalid allowance value: ${item.allowance}`) 
    }

    return [{        
        kind: TezosOperationType.TRANSACTION,
        destination: item.token_contract,
        amount: "0",
        parameters: {
            entrypoint: approveEntrypoint,
            value: JSON.parse(`{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.allowance}"}]}`)
        },
    }, {        
        kind: TezosOperationType.TRANSACTION,
        destination: item.token_contract,
        amount: "0",
        parameters: {
            entrypoint: approveEntrypoint,
            value: JSON.parse(`{"prim":"Pair","args":[{"string":"${spender}"},{"int":"0"}]}`)
        },
    }];
}

function processFa2(item, spender)  {
    if (!item.token_id || typeof item.token_id !== 'number') {
        throw new Error(`invalid token_id value: ${item.token_id}`) 
    }

    return [{        
        kind: TezosOperationType.TRANSACTION,
        destination: item.token_contract,
        amount: "0",
        parameters: {
            entrypoint: updateOperatorsEntrypoint,
            value: JSON.parse(`{"prim":"Left","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.token_id}"}]}]}]}`)
        },
    }, {        
        kind: TezosOperationType.TRANSACTION,
        destination: item.token_contract,
        amount: "0",
        parameters: {
            entrypoint: updateOperatorsEntrypoint,
            value: JSON.parse(`{"prim":"Right","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.token_id}"}]}]}]}`)
        },
    }];
}