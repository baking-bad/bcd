var bs58check = require("bs58check");
var dayjs = require("dayjs");

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

export function shortcut(value, tail = 4) {
    if (!value) return '';

    let head = 0;
    if (value.startsWith('tz') || value.startsWith('KT')) {
        head = 3
    } else if (value.startsWith('o')) {
        head = 1;
    } else if (value.startsWith('expr')) {
        head = 4;
    } else {
        return value;
    }
    return `<span class="font-weight-light">${value.slice(0, head)}</span>` +
        `${value.slice(head, head + tail)}` +
        `<i class="v-icon notranslate mdi mdi-dots-horizontal" style="font-size: 16px;"></i>` +
        `${value.slice(value.length - tail)}`
}

export function formatDatetime(timestamp) {
    let d = dayjs(timestamp);
    if (timestamp) {
        if (d.year() < dayjs().year()) return d.format("D MMM'YY HH:mm");
        if (d.add(1, "days").isBefore(dayjs())) return d.format("D MMM HH:mm");
        return d.fromNow();
    }
}

export function formatDate(timestamp) {
    let d = dayjs(timestamp);
    if (timestamp) {
        if (d.year() < dayjs().year()) return d.format("D MMM'YY");
        if (d.add(1, "days").isBefore(dayjs())) return d.format("D MMM");
        return d.fromNow();
    }
}

export function plural(count, noun, suffix = 's') {
    return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

export function urlExtractBase58(url) {
    const matches = url.match(/\b(tz|KT|o|expr)[1-9A-HJ-NP-Za-km-z]{34,}\b/);
    if (matches && matches.length > 0) {
        return matches[0];
    }
}

export function round(value, decimals) {
    return parseFloat((value / 10 ** decimals).toFixed(decimals));
}