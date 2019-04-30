import * as moment from 'moment';

export function formatDate(date): string {
    let dateToFormat;
    dateToFormat = moment(date);
    return dateToFormat.isSame(moment(), 'd')
            ? dateToFormat.format('HH:mm')
            : dateToFormat.isSame(moment().subtract(1, 'days'), 'd')
              ? 'Hier'
              : dateToFormat.isAfter(moment().subtract(7, 'days'))
                ? dateToFormat.format('ddd')
                : dateToFormat.format('DD MMMM');
}
