export function getTzKTLink(network, address_or_hash) {
    if (network === "mainnet")
        return `https://tzkt.io/${address_or_hash}`;
    else if (network === "babylonnet")
        return `https://babylon.tzkt.io/${address_or_hash}`;
    else if (network === "carthagenet")
        return `https://carthage.tzkt.io/${address_or_hash}`;
    else if (network === "zeronet")
        return `https://zeronet.tzkt.io/${address_or_hash}`;
}