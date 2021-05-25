import { Item } from '@models/item.model';
import { arraySum, round } from '@utils/math.util';

/**
 * Minimal suggested bonus (€)
 */
export const staticBonus = 10;

/**
 * Percentage applied to the total price of the requested items
 * to start bonus estimation
 */
export const bonusPercentage = 0.15;

/**
 * Oko variable fees applied to the global transaction price (items total price + bonus)
 */
export const feesPercentage = 0.075;

/**
 * Oko statif fees applied to the global transaction price (after application of variable fees)
 */
export const staticFees = 1.5;

/**
 * Estimates a suggestion of traveler's bonus
 *  Bonus calculation takes into account:
    * - The items price
    *   A percentage (bonusPercentage) is applied to the global price of items, never going under 10€
    * - The number of items
    *   Adding 2.5€ for every item if there are more than one
    * - The weight of items
    *   Adding 1€ / kg if global weight exceeds 5kg
    * - The meeting point
    *   Adding 10€ for delivery elsewhere than the arrival airport
 * @param items : Array of requested items
 * @param airportPickup : Pickup of items at the airport
 */
export function estimateBonus(items: Array<Item>, airportPickup: boolean) {
    let itemsPrice = arraySum(items.map(item => item.price));
    let itemsWeight = arraySum(items.map(item => item.weight));
    if (Number.isNaN(itemsWeight)) {
      itemsWeight = 0;
    }
    if (Number.isNaN(itemsPrice)) {
        itemsPrice = 0;
    }
    itemsWeight = itemsWeight > 5 ? itemsWeight - 5 : 0;
    let estimation = itemsPrice * bonusPercentage
    + (items.length - 1) * 2.5
    + itemsWeight * 1;
    estimation = estimation > staticBonus ? estimation : staticBonus;
    if (!airportPickup) {
      estimation += 10;
    }
    return Math.ceil(estimation);
}

export function calculateTotalPrice(itemsPrice, bonus) {
    const preFeesPrice = itemsPrice + bonus;
    const fees = preFeesPrice * feesPercentage + staticFees;
    return round(fees + preFeesPrice, 2);
}
