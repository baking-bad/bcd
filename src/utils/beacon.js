import { NetworkType } from '@airgap/beacon-sdk'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { Tezos } from '@taquito/taquito'

async function setup(networkType) {
    Tezos.setProvider({ rpc: networkType.rpcUrl });

    let wallet = new BeaconWallet({ name: 'Better Call Dev' });
    Tezos.setWalletProvider(wallet);
    await wallet.requestPermissions({ network: networkType });
}

async function contractCall(address, method, args) {
    let contract = await Tezos.wallet.at(address)
    let result = await contract.methods[method](...args).send()
    return result.opHash
}

export async function call(network, address, method, args) {
    let networkTypes = {
        mainnet: {
            type: NetworkType.MAINNET,
            rpcUrl: 'https://rpc.tzkt.io/mainnet'
        },
        carthagenet: {
            type: NetworkType.CARTHAGENET,
            rpcUrl: 'https://rpc.tzkt.io/carthagenet'
        }
    }
    if (network in networkTypes) {
        await setup(networkTypes[network])
        await contractCall(address, method, args)
    }
}
