import moment from 'moment';

export const displayDate = (date) => {
    return moment(date).format('DD-MMM-YYYY');
}
