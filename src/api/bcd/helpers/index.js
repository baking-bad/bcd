import { RequestFailedError } from "@/api/bcd/errors";

export const MAX_SIZE = 10;

export function returnResponseData(res) {
    if (!res) {
        return res;
    }
    if (res.status !== 200) {
        throw new RequestFailedError(res);
    }
    return res.data
}

export function returnRequestResponse(res) {
    if (!res) {
        return res;
    }
    if (res.status !== 200) {
        throw new RequestFailedError(res);
    }
    return res.request.response;
}
