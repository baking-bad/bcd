import { BeaconEvent, ColorMode, DAppClient, NetworkType, PermissionScope } from "@tezos-x/octez.connect-sdk";
import TZKTBlockExplorer from "@/utils/tzkt";

const CORRECT_NETWORK_TYPES = {
    "sandboxnet": NetworkType.CUSTOM,
    "rollupnet": NetworkType.CUSTOM,
    "ushuaianet": NetworkType.CUSTOM,
    "tezosx": NetworkType.CUSTOM,
}

function getNetworkType(network) {
    return network in CORRECT_NETWORK_TYPES ? CORRECT_NETWORK_TYPES[network] : NetworkType[network.toUpperCase()]
}

export function isCustom(network) {
    return network === NetworkType.CUSTOM;
}

export class Wallet {
    static async getWallet(network, eventHandlers = null) {
        if (Wallet.wallet) return Wallet.wallet
        
        const networkType = getNetworkType(network);
        
        Wallet.wallet = new DAppClient({
            name: "Better Call Dev",
            eventHandlers,
            enableMetrics: true,
            network: isCustom(networkType)
            ? {
                type: networkType,
                name: network,
                rpcUrl: window.config?.rpc_endpoints?.[network]
            }
            : {
                type: networkType
            },
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

        const networkType = getNetworkType(network);
        if (Wallet.wallet) {
            if (Wallet.wallet.network?.type !== networkType || (isCustom(networkType) && Wallet.wallet.network?.name !== network)) {
                await this.disconnect();
            } else {
                client = Wallet.wallet;
                await Wallet.setTheme();
            }
        }
        
        if (!client) {
            client = await Wallet.getWallet(network, eventHandlers)
        }

        if (!Wallet.isPermissionGiven && client) {
            await this.getNewPermissions();
        }

        Wallet.changer[0] = 'connect' + Wallet.wallet.requestCounter[0]

        return client;
    }

    static getLastUsedAccount() {
        const accounts = localStorage.getItem('beacon:accounts');
        if(!accounts) return null

        const communicationPeersDapp = localStorage.getItem('beacon:communication-peers-dapp');
        const postmessagePeersDapp =  localStorage.getItem('beacon:postmessage-peers-dapp');
        let peers = [];

        if(communicationPeersDapp) {
            peers = [...peers, ...JSON.parse(communicationPeersDapp)]
        }

        if(postmessagePeersDapp) {
            peers = [...peers, ...JSON.parse(postmessagePeersDapp)]
        }

        const parsedAccounts = JSON.parse(accounts);
        const connectionTimes = parsedAccounts.map(item => item.connectedAt);
        const recentConnectionTime = Math.max(...connectionTimes);
        const lastAccount = parsedAccounts.find(item => item.connectedAt === recentConnectionTime);
        const extension = peers.find(item => item.extensionId === lastAccount?.origin?.id || item.publicKey  === lastAccount?.origin?.id);

        if(extension) {
            lastAccount.walletName = extension.name
        }

        return lastAccount;
    }

    static async getNewPermissions() {
        const activeAccount = await this.wallet.getActiveAccount();
        if(activeAccount) {
            Wallet.isPermissionGiven = true;
            return;
        }

        const scopes = [
            PermissionScope.OPERATION_REQUEST,
            PermissionScope.SIGN,
        ];
        try {
            await this.wallet.requestPermissions({ scopes });
            Wallet.isPermissionGiven = true;
        } catch (err) {
            if (err.title && err.title.toUpperCase() === 'ABORTED') {
                console.log('Permission request aborted by the user');
            } else {
                console.error('Error requesting permissions', err);
            }

            Wallet.isPermissionGiven = false;
        }
    }

    static async disconnect() {
        if (Wallet.wallet) {
            try {
                await Wallet.wallet.disconnect();
            } catch (error) {
                await Wallet.wallet.clearActiveAccount();                
            } finally {
                await new Promise(resolve => setTimeout(resolve, 100));

                Wallet.wallet = null;
                Wallet.isPermissionGiven = false;
            }
        }
    }

    static async setTheme() {
        if (!Wallet.wallet) return;
        let mode = localStorage.getItem("dark") === 'true' ? ColorMode.DARK : ColorMode.LIGHT;
        await Wallet.wallet.setColorMode(mode);
    }
}
Wallet.changer = {}