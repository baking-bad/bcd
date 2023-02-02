import {checkAddress} from './tz.js';
import { TezosOperationType } from '@airgap/beacon-sdk'


const approveEntrypoint = 'approve';
const updateOperatorsEntrypoint = "update_operators"

export function approveData(tokenApprovals, spender) {
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
    tokenApprovals.forEach(item => {
        if (!checkAddress(item.value.tokenContract)) {
            throw new Error(`invalid token contract address: ${item.value.tokenContract}`) 
        }

        if (item.type == 1) {
            let body = processFa1(item.value, spender);
            result.fa1.approves.push(body[0]);
            result.fa1.revokes.push(body[1]);
        } else if (item.type == 2) {
            let body = processFa2(item.value, spender);
            result.fa2.approves.push(body[0]);
            result.fa2.revokes.push(body[1]);
        }
    });

    return result;
}

function processFa1(item, spender) {
    if (!item.allowance && typeof item.allowance !== 'number') {
        throw new Error(`invalid allowance value: ${item.allowance}`) 
    }

    return [{        
        kind: TezosOperationType.TRANSACTION,
        destination: item.tokenContract,
        amount: "0",
        parameters: {
            entrypoint: approveEntrypoint,
            value: JSON.parse(`{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.allowance}"}]}`)
        },
    }, {        
        kind: TezosOperationType.TRANSACTION,
        destination: item.tokenContract,
        amount: "0",
        parameters: {
            entrypoint: approveEntrypoint,
            value: JSON.parse(`{"prim":"Pair","args":[{"string":"${spender}"},{"int":"0"}]}`)
        },
    }];
}

function processFa2(item, spender)  {
    if (!item.tokenId && typeof item.tokenId !== 'number') {
        throw new Error(`invalid tokenId value: ${item.tokenId}`) 
    }

    return [{        
        kind: TezosOperationType.TRANSACTION,
        destination: item.tokenContract,
        amount: "0",
        parameters: {
            entrypoint: updateOperatorsEntrypoint,
            value: JSON.parse(`[{"prim":"Left","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.tokenId}"}]}]}]}]`)
        },
    }, {        
        kind: TezosOperationType.TRANSACTION,
        destination: item.tokenContract,
        amount: "0",
        parameters: {
            entrypoint: updateOperatorsEntrypoint,
            value: JSON.parse(`[{"prim":"Right","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.tokenId}"}]}]}]}]`)
        },
    }];
}