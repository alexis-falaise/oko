export function validUrl(url: string): boolean {
    const isHttp = url.indexOf('http://') !== -1;
    const isHttps = url.indexOf('https://') !== -1;
    if (isHttp || isHttps) {
        return true;
    } else {
        return false;
    }
}
