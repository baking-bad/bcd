export class RequestFailedError extends Error {
    constructor(response) {
        super(response);
        this.code = response.status;
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}
