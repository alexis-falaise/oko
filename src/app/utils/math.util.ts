export function round(number: number, decimals: number) {
    return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function arraySum(array: Array<number>) {
    return array.reduce((sum, value) =>  sum + (Number.isNaN(value) ? 0 : value), 0);
}

export function arrayAvg(array: Array<number>) {
    if (array.length) {
        return array.reduce((sum, value) => sum + (Number.isNaN(value) ? 0 : value), 0) / array.length;
    } else {
        return 0;
    }
}

export function degToRad(number: number) {
    return number * Math.PI / 180;
}

export function radToDeg(number: number) {
    return number * 180 / Math.PI;
}

export interface Coords {
    latitude: number;
    longitude: number;
    altitude: number;
}

/**
 * Converts two sets of coordinates into a metric distance (in km)
 * @param coordA : Coordinates
 * @param coordB : Coordinates
 * @param step : Precision step (deg)
 */
export function coordDistance(coordA: Coords, coordB: Coords, step = 0.1) {
    const latitudeInKilometers = 111;
    const eqLongitudeInKilometers = 111.32;
    const latDiff = Math.abs(coordB.latitude - coordA.latitude);
    const longDiff = Math.abs(coordB.longitude - coordA.longitude);
    const ratio = latDiff / longDiff;
    const latAvg = arrayAvg([coordB.latitude, coordA.latitude]);
    const longitudeSteps = [];

    let leftBound, rightBound, latitudeAscendant, latitudeReference;
    leftBound = Math.min(coordA.longitude, coordB.longitude);
    rightBound = Math.max(coordA.longitude, coordB.longitude);
    latitudeAscendant = coordB.latitude > coordA.latitude;
    latitudeReference = coordA.latitude;

    for (let i = 0; i < rightBound - leftBound; i += step) {
        const nextLatitude = latitudeReference + (latitudeAscendant ? (i * ratio) : -(i * ratio));
        longitudeSteps.push(nextLatitude);
    }
    const latKm = latitudeInKilometers * latDiff;
    let longKm;
    if (longitudeSteps && longitudeSteps.length) {
        longKm = longitudeSteps.reduce((sum, value) => sum + (eqLongitudeInKilometers * step * Math.cos(degToRad(value))), 0);
    } else {
        longKm = longDiff * latitudeInKilometers * Math.cos(degToRad(latAvg));
    }
    const longKmAvg = longDiff * latitudeInKilometers * Math.cos(degToRad(latAvg));
    return Math.sqrt(latKm ** 2 + longKm ** 2);
}
