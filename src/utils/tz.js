var bs58check = require("bs58check");

export function checkAddress(address) {
    if (address === undefined && address == null) return false;
    if (typeof address !== "string") return false;
    if (address.length != 36 && !address.startsWith("KT")) return false;
    if (bs58check.decode(address) === undefined) return false;
    return true;
}

export function checkOperation(operation) {
    if (operation === undefined && operation == null) return false;
    if (typeof operation !== "string") return false;
    if (operation.length != 51 && !operation.startsWith("o")) return false;
    if (bs58check.decode(operation) === undefined) return false;
    return true;
}

export function checkKeyHash(keyhash) {
    if (keyhash === undefined && keyhash == null) return false;
    if (typeof keyhash !== "string") return false;
    if (keyhash.length != 54 && !keyhash.startsWith("expr")) return false;
    if (bs58check.decode(keyhash) === undefined) return false;
    return true;
}