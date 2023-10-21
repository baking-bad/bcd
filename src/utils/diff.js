import dayjs from "dayjs";

export const delimiter = '➛';

function getId() {
    return Math.floor(Math.random() * (+100000000 - +1)) + +1;
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
        let ts = parseTimestamp(val);
        if (ts) {
            return ts.format("DD MMMM YYYY HH:mm");
        }
    } else if (typ === "nat" || typ === 'int') {
        return formatInt(val);
    }
    if (val === undefined) return 'null';
    return val;
}

function formatInt(x) {
        return x ? x.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';
}

function getValue(x) {
    if (x.diff_type === 'update') {
        return `${formatValue(x.from, x.type)} ${delimiter} ${formatValue(x.value, x.type)}${valueDiff(x)}`
    }
    return formatValue(x.value, x.type)
}

function valueDiff(x) {
    if (!x.type) return '';

    if (x.type === 'nat' || x.type === 'int') {
        let value = parseInt(x.value, 10) - parseInt(x.from ? x.from : 0, 10);
        return ` (${value > 0 ? '+' : ''}${value.toLocaleString(undefined)})`
    } else if (x.type === 'timestamp') {
        let from = parseTimestamp(x.from);
        if (!from) return '';
        let to = parseTimestamp(x.value);
        if (!to) return '';        
        return ` (${to.from(from, true)})`
    }
    return '';
}

function parseTimestamp(value) {
    if (typeof value === 'string') {
        let d = dayjs(value);
        if (d.isValid())
            return d;
    } else {
        let d = dayjs(value * 1000);
        if (d.isValid())
            return d;
    }
    return null;
}

function deducePrim(x) {
    if (x.prim === 'bytes') {
        if (x.value === 'None') {
            return 'option';
        }
        if (x.value === 'True' || x.value === 'False') {
            return 'bool';
        }
        if (x.value === '{}') {
            return 'map';
        }
        if (x.value === '[]') {
            return 'list';
        }
        if (/({|}|DIP|DUP|CAR|FAILWITH|Pair|Left|Right|Unit|Elt)/.test(x.value)) {
            return 'lambda';
        }
        if (/^"(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}"$/.test(x.value)) {
            return 'address';
        }
        if (/^\d+$/.test(x.value)) {
            return 'nat';
        }
        if (/"\w+"/.test(x.value)) {
            return 'string';
        }
    }
    return x.prim;
}

function unwrap(x) {
    return String(x).replace(/^"(.*)"$/, '$1');
}

function parseItem(x, compactPair) {
    let item = {
        name: x.name,
        children: [],
        value: getValue(x),
        type: "value",
        id: getId(),
        kind: parseDiffType(x.diff_type),
        from: unwrap(x.from),
        val: unwrap(x.value),
        prim: x.prim,
        realPrim: deducePrim(x),
        diffType: x.diff_type
    }

    if (x.children) {
        item.type = 'object';
        item.children = getTree(x.children, false, compactPair);
        item.value = `${item.children.length} items`;
    }

    if (item.value === undefined) item.value = 'null';
    return [item];
}

function parseMap(x, compactPair) {
    const label = x.prim === 'big_map' ? 'diffs' : 'items'
    let item = {
        name: x.name,
        children: [],
        value: (x.value !== undefined && x.value !== null) ? x.value : `0 ${label}`,
        type: "object",
        value_type: x.type,
        prim: x.prim,
        realPrim: x.prim,
        val: x.prim === 'big_map' && x.value !== undefined && x.value !== null ? String(x.value) : undefined,
        id: getId(),
        kind: parseDiffType(x.diff_type),
        count: x.count,
    }

    if (x.children) {
        item.children = getTree(x.children, false, compactPair);
        item.value = `${item.children.length} ${label}`;
    }

    return [item];
}

function parseNamedTuple(x) {
    let res = [];
    x.children.forEach(item => {
        res.push(...parseItems(item))
    })
    return res;
}

function parseTuple(x, isRoot = false) {
    if (isRoot) {
        if (x.children) {
            let res = [];
            x.children.forEach((xChild, idx) => {
                let node = getTree(xChild)
                node[0].name = String(idx);
                res.push(...node);
            })
            return res;
        }
        return [{
            id: getId(),
            name: x.name,
            type: 'object',
            children: [],
            value: '0 items',
            kind: parseDiffType(x.diff_type)
        }]
    }

    let children = [];
    if (x.children) {
        x.children.forEach((xChild, idx) => {
            let node = getTree(xChild)
            node[0].name = String(idx);
            children.push(node[0]);
        })
    }

    return [{
        id: getId(),
        name: x.name,
        type: 'object',
        children: children,
        value: children.length ? `${children.length} items` : '0 items',
        kind: parseDiffType(x.diff_type),
    }];
}

function parseItems(x, compactPair, isRoot = false) {
    if (x.type === 'list' || x.type === 'set' || x.type === 'tuple' || x.type === 'union') {
        return parseTuple(x, isRoot);
    }
    if (x.type === 'map' || x.type === 'big_map') {
        return parseMap(x, compactPair);
    }
    if ((x.type === 'namedtuple' || x.type === 'namedunion') && isRoot) {  // TODO: why isRoot == true only?
        return parseNamedTuple(x);
    }
    return parseItem(x, compactPair)
}

export function getTree(data, isRoot = false, compactPair = false) {
    let res = [];
    if (data instanceof Array) {
        data.forEach(x => {
            res.push(...parseItems(x, compactPair, isRoot));
        })
    } else if (data instanceof Object) {
        res.push(...parseItems(data, compactPair, isRoot));
    }
    return res;
}
