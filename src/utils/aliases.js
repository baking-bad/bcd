const aliasesKey = 'aliases';
const expiryKey = 'expiry_aliases'

export class Aliases {
    constructor(size) {
        this.size = size;
        this.aliases = JSON.parse(localStorage.getItem(aliasesKey)) || {};

        this.setExpiryKey();
    }

    add(key, alias) {
        let keys = Object.keys(this.aliases);
        if (keys.length === this.size) {
            delete this.aliases[keys[0]]
        }

        this.checkExpirationTime();
        this.aliases[key] = alias;        
        localStorage.setItem(aliasesKey, JSON.stringify(this.aliases));
    }

    get(key) {
        this.checkExpirationTime();
        return this.aliases[key];
    }

    setExpiryKey() {
        const expiryString = localStorage.getItem(expiryKey);
        if (!expiryString) {
            this.expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
            localStorage.setItem(expiryKey, this.expiry);
        } else {
            this.expiry = parseInt(expiryString, 10);
        }
    }

    checkExpirationTime() {
        const now = new Date().getTime();
        console.log(now, this.expiry)
        if (now > this.expiry) {
            this.aliases = {};
            localStorage.removeItem(aliasesKey);
            localStorage.removeItem(expiryKey);
            this.setExpiryKey();
        }
    }
}

