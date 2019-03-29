export function round(number: number, decimals: number) {
    return Math.round(number * 10 ** decimals) / 10 ** decimals;
}
