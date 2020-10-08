const historyKey = 'history';
const historySize = 10;

const isDroppedKey = 'isDropped';

export function getHistory() {
    if (!isDropped()) {
        localStorage.setItem(historyKey, JSON.stringify([]));
        setIsDropped();
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
    localStorage.setItem(historyKey, JSON.stringify(history.filter(x => JSON.stringify(x) !== JSON.stringify(item))));
}

function isDropped() {
    return JSON.parse(localStorage.getItem(isDroppedKey)) || false;
}

function setIsDropped() {
    return localStorage.setItem(isDroppedKey, true);
}