export function getTzKTLink(network, address) {
    if (address.startsWith("tz")) {
        if (network === "mainnet")
            return `https://tzkt.io/${address}`;
        else if (network === "babylonnet")
            return `https://babylon.tzkt.io/${address}`;
        else if (network === "carthagenet")
            return `https://carthage.tzkt.io/${address}`;
    }
}