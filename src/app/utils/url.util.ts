export function validUrl(url: string): boolean {
    const isHttp = url.indexOf('http://') !== -1;
    const isHttps = url.indexOf('https://') !== -1;
    if (isHttp || isHttps) {
        return true;
    } else {
        return false;
    }
}

export function extractHostname(url: string): string {
    if (url) {
        const withoutProtocol = url.split('://')[1];
        const firstSegment = withoutProtocol.split('/')[0];
        return firstSegment;
    } else {
        return '';
    }
}
