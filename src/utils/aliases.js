const aliasesKey = 'aliases';

export class Aliases {
    constructor(size) {
        this.size = size;
        this.aliases = JSON.parse(localStorage.getItem(aliasesKey)) || {};
    }

    add(key, alias) {
        let keys = Object.keys(this.aliases);
        if (keys.length === this.size) {
            delete this.aliases[keys[0]]
        }
        this.aliases[key] = alias;
        localStorage.setItem(aliasesKey, JSON.stringify(this.aliases));
    }

    get(key) {
        return this.aliases[key];
    }
}

