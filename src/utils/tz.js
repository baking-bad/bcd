var bs58check = require("bs58check");

export function checkAddress(address) {
    if (address === undefined && address == null) return false;
    if (typeof address !== "string") return false;
    if (address.length != 36 && !address.startsWith("KT")) return false;
    if (bs58check.decode(address) === undefined) return false;
    return true;
}