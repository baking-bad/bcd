const bookmarksKey = 'bookmarks';

export class Bookmarks {
    constructor() {
        this.observers = [];
    }

    getAll() {
        return JSON.parse(localStorage.getItem(bookmarksKey)) || {};
    }

    add(key, bookmark) {
        let bookmarks = this.getAll();
        bookmarks[key] = bookmark;
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
        this.observers.forEach(observer => observer('added', key, bookmark))
    }

    remove(key) {
        let bookmarks = this.getAll();
        delete bookmarks[key];
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));

        this.observers.forEach(observer => observer('remove', key))
    }

    registerObserver(observer) {
        this.observers.push(observer)
    }
}

