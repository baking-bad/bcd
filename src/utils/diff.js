import dayjs from "dayjs";

function getId() {
    return Math.floor(Math.random() * (+100000000 - +1)) + +1;
}

function isArray(x) {
    return x.type === 'list' || x.type === 'set' || x.type === 'tuple'
}

function parseDiffType(diffType) {
    if (diffType === 'create') {
        return 'added-tree-item'
    } else if (diffType === 'update') {
        return 'edited-tree-item'
    } else if (diffType === 'delete') {
        return 'removed-tree-item'
    }
    return '';
}

function formatValue(val, typ) {
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
    if (val === undefined) return 'null';
    return val;
}

function getValue(x) {
    if (x.type === 'big_map' && x.children && x.children.length == 0) {
        return x.value;
    }
    if (x.diff_type === 'update') {
        return `${formatValue(x.from, x.type)} -> ${formatValue(x.value, x.type)}`
    }
    return formatValue(x.value, x.type)
}

function parseItem(x) {
    let item = {
        name: x.name || x.type,
        children: [],
        value: getValue(x),
        type: "value",
        id: getId(),
        kind: parseDiffType(x.diff_type)
    }

    if (x.children) {
        item.type = 'object';
        item.children = getTree(x.children);
        item.value = `${item.children.length} items`;
    }

    if (item.value === undefined) item.value = 'null';
    return [item];
}

function parseMap(x) {
    let item = {
        name: x.name || x.type,
        children: [],
        value: x.value ? x.value : '0 items',
        type: "object",
        value_type: x.type,
        id: getId(),
        kind: parseDiffType(x.diff_type)
    }

    if (x.children) {
        item.children = getTree(x.children);
        item.value = `${item.children.length} items`;
    }

    return [item];
}

function parseNamedTuple(x) {
    let res = [];
    x.children.forEach(item => {
        if (isArray(item) && item.children) {
            let node = {
                name: item.name,
                type: 'object',
                children: parseItems(item),
                id: getId(),
            }
            res.push(node)
        } else {
            res.push(...parseItems(item))
        }
    })
    return res;
}

function parseTuple(x, isRoot = false) {
    if (isRoot) {        
        if (x.children) {
            let res = [];
            x.children.forEach((x, idx) => {
                let node = getTree(x)
                node[0].name = String(idx);
                res.push(...node);
            })
            return res;
        }
        return [{
            id: getId(),
            name: x.name || x.type,
            type: 'object',
            children: [],
            value: '0 items',
            kind: parseDiffType(x.diff_type)
        }]
    }

    let children = [];
    if (x.children) {
        x.children.forEach((x, idx) => {
            let node = getTree(x)
            node[0].name = String(idx);
            children.push(node[0]);
        })
    }
    return [{
        id: getId(),
        name: x.name || x.type,
        type: 'object',
        children: children,
        value: children.length ? `${children.length} items` : '0 items',
        kind: parseDiffType(x.diff_type),
    }];
}

function parseItems(x, isRoot = false) {
    if (x.type === 'list' || x.type === 'set' || x.type === 'tuple' || x.type === 'union') {
        return parseTuple(x, isRoot);
    }
    if (x.type === 'map' || x.type === 'big_map') {
        return parseMap(x);
    }
    if ((x.type === 'namedtuple' || x.type === 'namedunion') && isRoot) {
        return parseNamedTuple(x);
    }
    return parseItem(x)
}

export function getTree(data, isRoot = false) {
    let res = [];
    if (data instanceof Array) {
        data.forEach(x => {
            res.push(...parseItems(x, isRoot));
        })
    } else if (data instanceof Object) {
        res.push(...parseItems(data, isRoot));
    }
    return res;
}
