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
    id: 'taxi-airport-led',
    base_price: 10,
    date_from: '2024-05-10T05:55:00.000Z',
    date_to: '2024-05-10T06:30:00.000Z',
    destination: 'airport-led',
    is_favorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'flight-airpirt-mrv',
    base_price: 100,
    date_from: '2024-05-10T07:40:00.000Z',
    date_to: '2024-05-10T11:20:00.000Z',
    destination: 'airport-mrv',
    is_favorite: false,
    offers: [
      'flight-business'
    ],
    type: 'flight'
  },
  {
    id: 'taxi-hotel-pyatigorsk',
    base_price: 7,
    date_from: '2024-05-10T12:00:00.000Z',
    date_to: '2024-05-10T12:50:00.000Z',
    destination: 'hotel-pyatigorsk',
    is_favorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'check-in-hotel-pyatigorsk',
    base_price: 200,
    date_from: '2024-05-10T12:55:00.000Z',
    date_to: '2024-05-13T14:00:00.000Z',
    destination: 'hotel-pyatigorsk',
    is_favorite: true,
    offers: [
      'apartment-lux'
    ],
    type: 'check-in'
  },
  {
    id: 'train-train-station-kislovodsk',
    base_price: 4,
    date_from: '2024-05-11T09:55:00.000Z',
    date_to: '2024-05-11T11:04:00.000Z',
    destination: 'train-station-kislovodsk',
    is_favorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
  {
    id: 'sightseeing-kislovodsk-park',
    base_price: 5,
    date_from: '2024-05-11T11:15:00.000Z',
    date_to: '2024-05-11T20:00:00.000Z',
    destination: 'kislovodsk-park',
    is_favorite: true,
    offers: [
      'excursion'
    ],
    type: 'sightseeing'
  },
  {
    id: 'train-train-station-pyatigorsk',
    base_price: 4,
    date_from: '2024-05-11T20:05:00.000Z',
    date_to: '2024-05-11T21:19:00.000Z',
    destination: 'train-station-pyatigorsk',
    is_favorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
];
