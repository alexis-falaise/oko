import { Airport } from '@models/airport.model';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Trip } from '@models/post/trip.model';

const planeSpeed = 900;

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

export function calculateTravelTime(originAirport: Airport, destinationAirport: Airport): number {
    const distance = airportsDistance(originAirport, destinationAirport);
    return distance / planeSpeed;
}

/**
 * Calculates flight arrival time
 * @param departureTime : Moment object for departure time
 * @param originAirport : Origin airport
 * @param destinationAirport : Destination airport
 * @param originTimezone : Option to send arrival time in origin airport timezone
 */
export function arrivalTime(
    departureTime: Moment,
    originAirport: Airport,
    destinationAirport: Airport,
    originTimezone = false
    ): Moment {
    if (originAirport && destinationAirport) {
        const timezoneDiff = destinationAirport.timezone - originAirport.timezone;
        const travelTime = calculateTravelTime(originAirport, destinationAirport);
        const originTimezoneArrivalTime = moment(departureTime).add(travelTime, 'h');
        const destinationTimezoneArrivalTime = moment(originTimezoneArrivalTime).add(timezoneDiff, 'h');
        return originTimezone ? originTimezoneArrivalTime : destinationTimezoneArrivalTime;
    } else {
        return null;
    }
}

/**
 * Helper to calculate distance between two airports
 * @param airportA : Airport
 * @param airportB : Airport
 */
export function airportsDistance(airportA: Airport, airportB: Airport): number {
    const origin: Coords = {
      latitude: airportA.latitude,
      longitude: airportA.longitude,
      altitude: airportA.altitude,
    };
    const destination: Coords = {
      latitude: airportB.latitude,
      longitude: airportB.longitude,
      altitude: airportB.altitude,
    };
    return round(coordDistance(origin, destination), 2);
}

/**
 * Converts two sets of coordinates into a metric distance (in km)
 * @param coordA : Coordinates
 * @param coordB : Coordinates
 * @param step : Precision step (deg)
 */
export function coordDistance(coordA: Coords, coordB: Coords, step = 0.1): number {
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
