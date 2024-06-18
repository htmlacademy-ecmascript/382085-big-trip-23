
/** */
export const EVENT_TYPE_ICONS = {
  'check-in': 'img/icons/check-in.png',
  'sightseeing': 'img/icons/sightseeing.png',
  'restaurant': 'img/icons/restaurant.png',
  'taxi': 'img/icons/taxi.png',
  'bus': 'img/icons/bus.png',
  'train': 'img/icons/train.png',
  'ship': 'img/icons/ship.png',
  'drive': 'img/icons/drive.png',
  'flight': 'img/icons/flight.png'
};


/** @type {import('./mock/trip').Waypoint} */
export const DUMMY_WAYPOINT = {
  id: 'none',
  type: 'flight',
  dateTo: (new Date()).toISOString(),
  dateFrom: (new Date()).toISOString(),
  basePrice: 10,
  offers: [],
  destination: 'kislovodsk-park',
  isFavorite: false,
};

export const DEFAULT_FILTER_ID = 'everything';
export const DEFAULT_SORT_ID = 'day';

export const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major'
};

export const UserAction = {
  ADD_WAYPOINT: 'add-waypoint',
  DELETE_WAYPOINT: 'delete-waypoint',
  UPDATE_WAYPOINT: 'update-waypoint',
};


export const BIG_TRIP_URI = 'https://23.objects.htmlacademy.pro/big-trip';
