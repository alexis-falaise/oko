import * as moment from 'moment';

export function sortByDate(a, b) {
    const isBefore = moment(a.date).isBefore(moment(b.date));
    return isBefore ? 1 : -1;
}
