export function getJwt() {
    return localStorage.getItem('token');
}

export function login(token) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}

export function getBool(key, _default = false) {
    const res = localStorage.getItem(key);
    if (res === null) {
        return _default;
    }
    return res === 'true' ? true : false;
}