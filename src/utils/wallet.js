import {DAppClient} from "@airgap/beacon-sdk";
import TZKTBlockExplorer from "@/utils/tzkt";

const CORRECT_NETWORK_TYPES = {
    "hangzhou2net": "hangzhounet",
}

export class Wallet {
    static async getWallet(network, eventHandlers = null) {
        if (Wallet.wallet) return Wallet.wallet

        Wallet.wallet = new DAppClient({
            name: "Better Call Dev",
            eventHandlers,
            preferredNetwork: network in CORRECT_NETWORK_TYPES ? CORRECT_NETWORK_TYPES[network] : network,
            blockExplorer: new TZKTBlockExplorer(),
        });

        return Wallet.wallet
    }

    static changeWalletState(cb) {
        const arrayChangeHandler = {
            set() {
                cb()
                return true
            }
        };
        Wallet.changer = new Proxy([], arrayChangeHandler);
    }

    static async getClient(network, eventHandlers, isLast) {
        let client;
        if (Wallet.wallet && !isLast) {
            Wallet.isPermissionGiven = false
            await this.getNewPermissions(network, isLast);
            client = Wallet.wallet ? Wallet.wallet : await Wallet.getWallet(network, eventHandlers);
        } else {
            client = Wallet.wallet ? Wallet.wallet : await Wallet.getWallet(network, eventHandlers);
            if (!Wallet.isPermissionGiven) {
                await this.getNewPermissions(network, isLast);
            }
        }

        Wallet.changer[0] = 'connect' + Wallet.wallet.requestCounter[0]

        return client;
    }

    static getLastUsedAccount() {
        const accounts = localStorage.getItem('beacon:accounts');
        const peers = localStorage.getItem('beacon:postmessage-peers-dapp');

        if(!accounts) return null
        const parsedAccounts = JSON.parse(accounts);
        const connectionTimes = parsedAccounts.map(item => item.connectedAt);
        const recentConnectionTime = Math.max(...connectionTimes);
        const lastAccount = parsedAccounts.find(item => item.connectedAt === recentConnectionTime);
        lastAccount.walletName =  JSON.parse(peers).find(item => item.extensionId === lastAccount.origin.id).name;

        return lastAccount;
    }

    static async getNewPermissions(network, isLast) {
        const rpcUrl = window.config.rpc_endpoints[network];
        const networkMap = {sandboxnet: "custom"};
        const type = networkMap[network] || network;
        if (!isLast) {
            await Wallet.wallet.clearActiveAccount();
        } else {
            await Wallet.wallet.setActiveAccount(Wallet.getLastUsedAccount());
        }


        const activeAccount = await this.wallet.getActiveAccount();

        return new Promise(async (resolve, reject) => {
            if(activeAccount) {
                Wallet.isPermissionGiven = true;
                return resolve();
            }

            try {
                await this.wallet.requestPermissions({
                    network: {
                        type: type in CORRECT_NETWORK_TYPES ? CORRECT_NETWORK_TYPES[type] : type,
                        rpcUrl
                    }
                });
                Wallet.isPermissionGiven = true
                resolve();
            } finally {
                reject();
            }
        })
    }
}
Wallet.changer = {}