import dayjs from 'dayjs';

export const FilterType = {
  ALL: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const FILTER_TO_MESSAGE_MAP = new Map([
  [FilterType.ALL, 'Click New Event to create your first point'],
  [FilterType.PAST, 'There are no past events now'],
  [FilterType.PRESENT, 'There are no present events now'],
  [FilterType.FUTURE, 'There are no future events now'],
]);


/**
 * @param {import('../mock/trip').Waypoint} waypoint
 * @returns {boolean}
 */
function filterFuture(waypoint) {
  return dayjs().isBefore(dayjs(waypoint.dateFrom));
}

/**
 * @param {import('../mock/trip').Waypoint} waypoint
 * @returns {boolean}
 */
function filterPast(waypoint) {
  return dayjs().isAfter(dayjs(waypoint.dateTo));
}

/**
 * @param {import('../mock/trip').Waypoint} waypoint
 * @returns {boolean}
 */
function filterPresent(waypoint) {
  return dayjs().isAfter(dayjs(waypoint.dateFrom))
    && dayjs().isBefore(dayjs(waypoint.dateTo));
}

export const FILTERS_OBJECT = {
  [FilterType.ALL]:     (waypoints) => waypoints,
  [FilterType.FUTURE]:  (waypoints) => waypoints.filter(filterFuture),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter(filterPresent),
  [FilterType.PAST]:    (waypoints) => waypoints.filter(filterPast)
};
