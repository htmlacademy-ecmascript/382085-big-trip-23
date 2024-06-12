import { FilterType } from '../constants';
import dayjs from 'dayjs';

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

export const filter = {
  [FilterType.ALL]:     (waypoints) => waypoints,
  [FilterType.FUTURE]:  (waypoints) => waypoints.filter(filterFuture),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter(filterPresent),
  [FilterType.PAST]:    (waypoints) => waypoints.filter(filterPast)
};
