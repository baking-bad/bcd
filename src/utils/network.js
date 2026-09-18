export const DATA_LOADING_STATUSES = {
    NOTHING: 'NOTHING',
    PROGRESS: 'PROGRESS',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

export function formatNetworkName(network) {
    return network ? network.replace(/_/g, ' ') : '';
}

export function isTezosxStackHost() {
    const stackUri = process.env.VUE_APP_TEZOSX_STACK_URI;
    if (!stackUri) return false;

    try {
        return new URL(stackUri).host === window.location.host;
    } catch (e) {
        return false;
    }
}
