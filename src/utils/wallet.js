import {DAppClient, ColorMode, NetworkType} from "@airgap/beacon-sdk";
import TZKTBlockExplorer from "@/utils/tzkt";

const CORRECT_NETWORK_TYPES = {
    "sandboxnet": NetworkType.CUSTOM,
    "rollupnet": NetworkType.CUSTOM,
}

export function isCustom(network) {
    return network === NetworkType.CUSTOM;
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

        await Wallet.setTheme();

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

        if (Wallet.wallet) {
            client = Wallet.wallet;
            await Wallet.setTheme();
        } else {
            client = await Wallet.getWallet(network, eventHandlers)
        }

        if (!isLast) {
            Wallet.isPermissionGiven = false            
            await this.getNewPermissions(network, isLast);            
        } else {
            if (!Wallet.isPermissionGiven) {
                await this.getNewPermissions(network, isLast);
            }
        }

        Wallet.changer[0] = 'connect' + Wallet.wallet.requestCounter[0]

        return client;
    }

    static getLastUsedAccount() {
        const accounts = localStorage.getItem('beacon:accounts');
        const communicationPeersDapp = localStorage.getItem('beacon:communication-peers-dapp');
        const postmessagePeersDapp =  localStorage.getItem('beacon:postmessage-peers-dapp');
        let peers = [];

        if(communicationPeersDapp) {
            peers = [...peers, ...JSON.parse(communicationPeersDapp)]
        }

        if(postmessagePeersDapp) {
            peers = [...peers, ...JSON.parse(postmessagePeersDapp)]
        }

        if(!accounts) return null
        const parsedAccounts = JSON.parse(accounts);
        const connectionTimes = parsedAccounts.map(item => item.connectedAt);
        const recentConnectionTime = Math.max(...connectionTimes);
        const lastAccount = parsedAccounts.find(item => item.connectedAt === recentConnectionTime);
        const extension = peers.find(item => item.extensionId === lastAccount.origin.id || item.publicKey  === lastAccount.origin.id);

        if(extension) {
            lastAccount.walletName = extension.name
        }

        return lastAccount;
    }

    static async getNewPermissions(network, isLast) {
        const rpcUrl = window.config.rpc_endpoints[network];
        const type = CORRECT_NETWORK_TYPES[network] || network;
        if (!isLast) {
            await Wallet.wallet.clearActiveAccount();
        } else {
            await Wallet.wallet.setActiveAccount(Wallet.getLastUsedAccount());
        }

        const activeAccount = await this.wallet.getActiveAccount();

        return new Promise((resolve, reject) => {
            if(activeAccount) {
                Wallet.isPermissionGiven = true;
                return resolve();
            }

            this.wallet.requestPermissions({
                network: {
                    type: type in CORRECT_NETWORK_TYPES ? CORRECT_NETWORK_TYPES[type] : type,
                    rpcUrl
                }
            })
            .then(() => {
                Wallet.isPermissionGiven = true;
                resolve();
            })
            .finally(() => reject())
        })
    }

    static async setTheme() {
        if (!Wallet.wallet) return;
        let mode = localStorage.getItem("dark") === 'true' ? ColorMode.DARK : ColorMode.LIGHT;
        await Wallet.wallet.setColorMode(mode);
    }
}
Wallet.changer = {}