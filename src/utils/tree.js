import dayjs from "dayjs";

export function getTree(data, kind) {
    let res = [];

    if (data.kind !== undefined) {
        kind = parseKind(data.kind);
        delete data.kind;
    }
    if (data.type !== undefined) {
        res.push({
            name: data.type,
            children: [],
            value: data.value || 'null',
            value_type: data.type,
            type: "value",
            kind: kind
        });
        return res;
    }

    for (const x in data) {
        let item = {
            name: x,
            children: [],
            value: "null",
            type: "value",
            kind: kind
        };
        if (typeof data[x] === "object") {
            if (data[x] != null) {
                if (data[x].kind !== undefined) {
                    item.kind = parseKind(data[x].kind);
                    delete data[x].kind;
                }

                if (data[x].value !== undefined && data[x].type !== undefined) {
                    item.value = getValue(data[x]);
                    item.value_type = data[x].type;
                } else {
                    item.value = `${Object.keys(data[x]).length} items`;
                    item.type = "object";
                    item.children = getTree(data[x], item.kind);
                }
            }
        } else {
            item.value = data[x];
        }
        res.push(item);
    }
    return res;
}

function getValue(item) {
    if (item.type === undefined || item.value === undefined) {
        return item;
    }

    if (item.from !== undefined) {
        let start = parseType(item.from, item.type);
        let end = parseType(item.value, item.type);
        return `${start} -> ${end}`;
    }
    return parseType(item.value, item.type)
}

function parseType(val, typ) {
    if (typ === "mutez") {
        let xtz = (val / 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 });
        return `${xtz} \uA729`;
    } else if (typ === "timestamp") {
        if (isNaN(parseInt(val, 10))) {
            return dayjs(val).format("D MMMM YYYY");
        } else {
            return dayjs(val * 1000).format("D MMMM YYYY HH:mm");
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