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
  type: 'train',
  dateTo: (new Date()).toISOString(),
  dateFrom: (new Date()).toISOString(),
  basePrice: 0,
  offers: [],
  destination: 'kislovodsk-park',
  isFavorite: false,
};

export const FILTER_ITEMS = ['Everything', 'Future', 'Present', 'Past'];
export const DEFAULT_FILTER_ITEM_INDEX = 0;

export const FilterType = {
  ALL: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

export const SORT_ITEMS = [
  {canSort: true, title: 'Day'},
  {canSort: false, title: 'Event'},
  {canSort: true, title: 'Time'},
  {canSort: true, title: 'Price'},
  {canSort: false, title: 'Offer'}
];

export const DEFAULT_SORT_ITEM_INDEX = 0;
