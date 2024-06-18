/**
* @typedef {('check-in'|'sightseeing'|'restaurant'|'taxi'|'bus'|'train'|'ship'|'drive'|'flight')} WaypointType
*/

/**
* @typedef {Object} Waypoint
* @prop {string} id
* @prop {number} basePrice
* @prop {string} dateFrom
* @prop {string} dateTo
* @prop {string} destination
* @prop {boolean} isFavorite
* @prop {string[]} offers
* @prop {WaypointType} type
*/

/**
* @typedef {Object} Offer
* @prop {string} id
* @prop {string} title
* @prop {number} price
*/

/**
* @typedef {Object} OffersListItem
* @prop {WaypointType} type
* @prop {Offer[]} offers
*/

/** @typedef {OffersListItem[]} OffersList */

/**
* @typedef {Object} PictureData
* @prop {string} src
* @prop {string} description
*/

/**
* @typedef {Object} Destination
* @prop {string} id
* @prop {string} description
* @prop {string} name
* @prop {PictureData[]} pictures
*/

/** @type {WaypointType[]} */
export const EVENT_TYPES = ['check-in', 'sightseeing', 'restaurant', 'taxi', 'bus', 'train', 'ship', 'drive', 'flight'];

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


/** @type {Waypoint} */
export const DUMMY_WAYPOINT = {
  type: 'flight',
  dateTo: (new Date()).toISOString(),
  dateFrom: (new Date()).toISOString(),
  basePrice: 10,
  offers: [],
  destination: '',
  isFavorite: false,
};

export const DEFAULT_FILTER_ID = 'everything';
export const DEFAULT_SORT_ID = 'day';

export const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
  INIT: 'init',
};

export const UserAction = {
  ADD_WAYPOINT: 'add-waypoint',
  DELETE_WAYPOINT: 'delete-waypoint',
  UPDATE_WAYPOINT: 'update-waypoint',
};


export const BIG_TRIP_URI = 'https://23.objects.htmlacademy.pro/big-trip';
