const historyKey = 'history';
const historySize = 10;

const isDroppedKey = 'isDropped';
const versionKey = 'version';
const version = '0';

export function getHistory() {
    if (!isCurrentVersion()) {
        localStorage.removeItem(isDroppedKey);
        localStorage.setItem(historyKey, JSON.stringify([]));
        setVersion();
    }
    return JSON.parse(localStorage.getItem(historyKey)) || [];
}

export function addHistoryItem(item) {
    let history = getHistory();
    history = history.filter(x => JSON.stringify(x) !== JSON.stringify(item))

    history.unshift(item)
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, historySize)));
}

export function removeHistoryItem(item) {
    let history = getHistory();
    localStorage.setItem(historyKey, JSON.stringify(history.filter(x => x.value !== item)));
}


function setVersion() {
    return localStorage.setItem(versionKey, version);
}

function isCurrentVersion() {
    let current = localStorage.getItem(versionKey);
    return current == version;
}