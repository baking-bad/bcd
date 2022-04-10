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