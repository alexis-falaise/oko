import * as moment from 'moment';

export function sortByDate(a, b, ascending = false) {
    const isBefore = moment(a).isBefore(moment(b));
    return ascending
    ? isBefore ? -1 : 1
    : isBefore ? 1 : -1;
}
