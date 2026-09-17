export const DATA_LOADING_STATUSES = {
    NOTHING: 'NOTHING',
    PROGRESS: 'PROGRESS',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

export function formatNetworkName(network) {
    return network ? network.replace(/_/g, ' ') : '';
}

export function getApiUri(config) {
    const uri = config && config.tezosx_stack
        ? process.env.VUE_APP_API_TEZOSX_URI
        : process.env.VUE_APP_API_URI;

    return uri || `${window.location.protocol}//${window.location.host}/v1`;
}
