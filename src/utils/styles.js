export function applyStyles(node) {
    if (!node) return;
    if (node.type) {
        const defaultTitle = {
            contract: "callback",
        };
        node["x-props"] = {
            outlined: true,
            dense: true,
            placeholder: node.prim,
            label: node.title || defaultTitle[node.prim] || "",
        };
        if (node.prim === "lambda") {
            node["x-display"] = "custom-codemirror";
        }
        if (node.prim === "contract") {
            node["x-display"] = "custom-contract";
        }
    }
    if (node.properties) {
        for (var prop in node.properties) {
            applyStyles(node.properties[prop]);
        }
    }
    if (node.oneOf) {
        for (var option in node.oneOf) {
            applyStyles(node.oneOf[option]);
        }
    }
    if (node.items) {
        applyStyles(node.items);
    }
}

export function getContentItemHeaderClass(status) {
    if (status === "skipped" || status === "backtracked") return "item-header-backtracked";
    if (status === "pending" || status === "lost") return "item-header-mempool";
    if (status !== "applied") return "item-header-failed";
    return `item-header-${status}`;
}