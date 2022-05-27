export function getQuery(name) {
    return location.search.substr(location.search.indexOf(name)).split('&')[0].split('=')[1];
}

export function isQuery(name) {
    return typeof getQuery(name) === 'string';
}

export function setQuery(query, value) {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(query, value);
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
}

export function isOldBigMapRoute(route) {
    const regex = /\/[A-Za-z]*\/big_map\/[0-9]+\/(keys)*\/?[A-Z0-9]*\/?/i;
    return String(route).match(regex);
}