export function makeTreeview(json, lastid = 0, result = []) {
    if (typeof json !== 'object' || json === null) {
        return result;
    }
    Object.keys(json).forEach(item => {
        const id = lastid++;
        if (typeof json[item] !== "object") {
            result.push({
                id,
                name: `${item}: ${json[item]}`
            })
        } else {
            result.push({
                id,
                name: `${item}:`,
                children: makeTreeview(json[item], lastid, [])
            })
        }
    })
    return result;
}
