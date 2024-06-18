import dayjs from 'dayjs';

/**
  * Функция сортировки по дате начала, от старых к новым
  * @param {import('./constants').Waypoint} left
  * @param {import('./constants').Waypoint} right
  * @returns {-1 | 0 | 1}
  */
function sortByDay(left, right) {
  if (!right || !left) {
    return -1;
  }

  const equal = dayjs(left.dateFrom).isSame(dayjs(right.dateFrom));
  if (equal) {
    return 0;
  }

  const after = dayjs(left.dateFrom).isAfter(dayjs(right.dateFrom));
  if (after) {
    return 1;
  }

  return -1;
}

/**
  * функция сортировки по длительности, от долгих к быстрым
  * @param {import('./constants').Waypoint} left
  * @param {import('./constants').Waypoint} right
  * @returns {-1 | 0 | 1}
  */
function sortByTimeDuration(left, right) {
  if (!right || !left) {
    return -1;
  }

  const leftDuration = dayjs(left.dateFrom).diff(dayjs(left.dateTo));
  const rightDuration = dayjs(right.dateFrom).diff(dayjs(right.dateTo));

  return leftDuration - rightDuration;
}

/**
  * функция сортировки по цене, от дорогих к дешёвым
  * @param {import('./constants').Waypoint} left
  * @param {import('./constants').Waypoint} right
  * @returns {-1 | 0 | 1}
  */
function sortByPrice(left, right) {
  if (!right || !left) {
    return -1;
  }

  return right.basePrice - left.basePrice;
}

export const SORT_ITEMS = new Map([
  ['day', {canSort: true, id: 'day', title: 'Day', sortFunction: sortByDay}],
  ['event', {canSort: false, id: 'event', title: 'Event', sortFunction: null}],
  ['time', {canSort: true, id: 'time', title: 'Time', sortFunction: sortByTimeDuration}],
  ['price', {canSort: true, id: 'price', title: 'Price', sortFunction: sortByPrice}],
  ['offer', {canSort: false, id: 'offer', title: 'Offer', sortFunction: null}],
]);

