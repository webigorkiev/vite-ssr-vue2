export const createUrl = (url: string | URL, base = 'http://e.g') => {
    url = url || "/";
    if(url instanceof URL) {
        return url;
    }
    if(!(url || '').includes('://')) {
        url = base + (url.startsWith("/") ? url : `/${url}`);
    }
    return new URL(url);
};