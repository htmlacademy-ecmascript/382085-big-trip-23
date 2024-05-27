// https://23.objects.htmlacademy.pro

/**
* @typedef {('check-in'|'sightseeing'|'restaurant'|'taxi'|'bus'|'train'|'ship'|'drive'|'flight')} WaypointType
*/

/**
* @typedef {Object} Waypoint
* @prop {string} id
* @prop {number} base_price
* @prop {string} date_from
* @prop {string} date_to
* @prop {string} destination
* @prop {boolean} is_favorite
* @prop {string[]} offers
* @prop {WaypointType} type
*/

/** @type Waypoint[] */
export const TRIP_WAYPOINTS = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 10,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'airport-led',
    is_favorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 100,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'airport-mrv',
    is_favorite: false,
    offers: [
      'flight-business'
    ],
    type: 'flight'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 7,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'hotel-pyatigorsk',
    is_favorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 200,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'hotel-pyatigorsk',
    is_favorite: true,
    offers: [
      'apartment-lux'
    ],
    type: 'checkin'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 4,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'train-station-kislovodsk',
    is_favorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 5,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'kislovodsk-park',
    is_favorite: true,
    offers: [
      'excursion'
    ],
    type: 'sightseeing'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    base_price: 4,
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: 'train-station-pyatigorsk',
    is_favorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
];
