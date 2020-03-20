import dayjs from "dayjs";

export function getTree(data, kind) {
    let res = [];

    if (Object.keys(data).length == 0) {
        res.push({
            name: 'map',
            children: [],
            value: '0 items',
            value_type: 'map',
            type: "object",
            kind: kind,
            id: getId()
        });
        return res;
    }

    if (data.miguel_kind !== undefined) {
        kind = parseKind(data.miguel_kind);
        delete data.miguel_kind;
    }

    if (data.miguel_type !== undefined) {
        res.push({
            name: data.miguel_type,
            children: [],
            value: getValue(data) || null,
            value_type: data.miguel_type,
            type: "value",
            kind: kind,
            id: getId()
        });
        return res;
    }

    if (data.miguel_from) {
        res.push(...getTree(data.miguel_from, kind))
        return res;
    }

    for (const x in data) {
        let item = {
            name: x,
            children: [],
            value: "null",
            type: "value",
            kind: kind,
            id: getId()
        };
        if (typeof data[x] === "object") {
            if (data[x] != null) {
                if (data[x].miguel_kind !== undefined) {
                    item.kind = parseKind(data[x].miguel_kind);
                    delete data[x].miguel_kind;
                }

                if (data[x].miguel_value !== undefined && data[x].miguel_type !== undefined) {
                    if (data[x].miguel_value != null)
                        item.value = getValue(data[x]);
                    item.value_type = data[x].miguel_type;
                } else {
                    item.type = "object";
                    if (Object.keys(data[x]).length == 0) {
                        item.value = `0 items`;
                    } else {
                        item.children = getTree(data[x], item.kind);
                        item.value = `${item.children.length} items`;
                    }
                }
            }
        } else {
            item.value = data[x];
        }
        res.push(item);
    }
    return res;
}

export function getEntrypointTree(data) {
    let res = [];
    if (data.miguel_type !== undefined) {
        let item = {
            name: '',
            children: [],
            value: data.miguel_type,
            type: "value",
            id: getId()
        }
        if (data.miguel_type === 'contract' || data.miguel_type === 'lambda') {
            item.value = `${data.miguel_type} (${data.miguel_parameters})`
        }
        if (data.miguel_type === 'list' || data.miguel_type === 'set') {
            item.value = getListType(data);
        }
        res.push(item);
        return res;
    }

    for (const x in data) {
        let item = {
            name: x,
            children: [],
            value: "",
            type: "value",
            id: getId()
        };
        if (typeof data[x] === "object" && data[x] != null) {
            if (data[x].miguel_type !== undefined) {
                if (data[x].miguel_type === 'contract' || data[x].miguel_type === 'lambda') {
                    item.value = `${data[x].miguel_type} (${data[x].miguel_parameters})`
                } else if (data[x].miguel_type === 'list' || data[x].miguel_type === 'set') {
                    item.value = getListType(data[x]);
                } else {
                    item.value = data[x].miguel_type
                }
            } else {
                item.type = "object";
                if (Object.keys(data[x]).length == 0) {
                    item.value = `0 items`;
                } else {
                    item.children = getEntrypointTree(data[x]);
                }
            }
        }
        res.push(item);
    }
    return res;
}

function getListType(item) {
    if (item.miguel_parameters === undefined) {
        return item.miguel_type;
    }

    let s = '';
    if (item.miguel_type !== undefined) {
        s += item.miguel_type;
    }

    s += ' (';
    for (let i = 0; i < item.miguel_parameters.length; i++) {
        s += getListType(item.miguel_parameters[i])
        if (i != item.miguel_parameters.length - 1) {
            s += ', '
        }
    }
    s += ')'
    return s;
}

function getId() {
    return Math.floor(Math.random() * (+100000000 - +1)) + +1;
}

function getValue(item) {
    if (item.miguel_from !== undefined && item.miguel_value !== undefined) {
        let start = parseType(item.miguel_from, item.miguel_type);
        let end = parseType(item.miguel_value, item.miguel_type);
        return `${start} -> ${end}`;
    }
    if (item.miguel_value !== undefined && item.miguel_type !== undefined)
        return parseType(item.miguel_value, item.miguel_type)
    if (item.miguel_type === 'unit') {
        return 'null';
    }
    return item;
}

function parseType(val, typ) {
    if (typ === "mutez") {
        let xtz = (val / 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 });
        return `${xtz} \uA729`;
    } else if (typ === "timestamp") {
        if (typeof val === 'string') {
            let d = dayjs(val);
            if (d.isValid())
                return d.format("DD MMMM YYYY HH:mm");
        } else {
            let d = dayjs(val * 1000);
            if (d.isValid())
                return d.format("DD MMMM YYYY HH:mm");
        }
    }
    return val;
}

function parseKind(kind) {
    if (kind === 'create') {
        return 'added-tree-item'
    } else if (kind === 'update') {
        return 'edited-tree-item'
    } else if (kind === 'delete') {
        return 'removed-tree-item'
    }
    return '';
}