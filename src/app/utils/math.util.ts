export function round(number: number, decimals: number) {
    return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function arraySum(array: Array<number>) {
    return array.reduce((sum, value) =>  sum + value, 0);
}

export function arrayAvg(array: Array<number>) {
    if (array.length) {
        return array.reduce((sum, value) => sum + value, 0) / array.length;
    } else {
        return 0;
    }
}
