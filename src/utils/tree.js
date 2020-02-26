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
            kind: ''
        });
        return res;
    }

    if (data.kind !== undefined) {
        kind = parseKind(data.kind);
        delete data.kind;
    }

    if (data.type !== undefined) {
        res.push({
            name: data.type,
            children: [],
            value: getValue(data.value) || 'null',
            value_type: data.type,
            type: "value",
            kind: kind
        });
        return res;
    }

    if (data.value) {
        res.push(...getTree(data.value, kind))
        return res;
    }

    if (data.from) {
        res.push(...getTree(data.from, kind))
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
                    if (data[x].value != null)
                        item.value = getValue(data[x]);
                    item.value_type = data[x].type;
                } else {
                    item.type = "object";
                    item.children = getTree(data[x], item.kind);
                    item.value = `${item.children.length} items`;
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
    if (item.from !== undefined && item.value !== undefined) {
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