const historyKey = 'history';
const historySize = 10

export function getHistory() {
    return JSON.parse(localStorage.getItem(historyKey)) || [];
}

export function addHistoryItem(item) {
    let history = getHistory();
    if (history.includes(item)) {
        history = history.filter(x => x !== item)
    }
    history.unshift(item)
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, historySize)));
}

export function removeHistoryItem(item) {
    let history = getHistory();
    localStorage.setItem(historyKey, JSON.stringify(history.filter(x => x !== item)));
}
