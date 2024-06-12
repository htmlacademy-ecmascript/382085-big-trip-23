// https://23.objects.htmlacademy.pro

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

/** @type Waypoint[] */
export const TRIP_WAYPOINTS = [];
/** @type Waypoint[] */
export const TRIP_WAYPOINTS2 = [
  {
    id: 'taxi-airport-led',
    basePrice: 10,
    dateFrom: '2024-05-10T05:55:00.000Z',
    dateTo: '2024-05-10T06:30:00.000Z',
    destination: 'airport-led',
    isFavorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'flight-airpirt-mrv',
    basePrice: 100,
    dateFrom: '2024-05-10T07:40:00.000Z',
    dateTo: '2024-05-10T11:20:00.000Z',
    destination: 'airport-mrv',
    isFavorite: false,
    offers: [
      'flight-business'
    ],
    type: 'flight'
  },
  {
    id: 'taxi-hotel-pyatigorsk',
    basePrice: 7,
    dateFrom: '2024-05-10T12:00:00.000Z',
    dateTo: '2024-05-10T12:50:00.000Z',
    destination: 'hotel-pyatigorsk',
    isFavorite: false,
    offers: [
      'taxi-comfort'
    ],
    type: 'taxi'
  },
  {
    id: 'check-in-hotel-pyatigorsk',
    basePrice: 200,
    dateFrom: '2024-05-10T12:55:00.000Z',
    dateTo: '2024-05-13T14:00:00.000Z',
    destination: 'hotel-pyatigorsk',
    isFavorite: true,
    offers: [
      'apartment-lux'
    ],
    type: 'check-in'
  },
  {
    id: 'train-train-station-kislovodsk',
    basePrice: 4,
    dateFrom: '2024-05-11T09:55:00.000Z',
    dateTo: '2024-05-11T11:04:00.000Z',
    destination: 'train-station-kislovodsk',
    isFavorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
  {
    id: 'sightseeing-kislovodsk-park',
    basePrice: 5,
    dateFrom: '2024-05-11T11:15:00.000Z',
    dateTo: '2024-05-11T20:00:00.000Z',
    destination: 'kislovodsk-park',
    isFavorite: true,
    offers: [
      'excursion'
    ],
    type: 'sightseeing'
  },
  {
    id: 'train-train-station-pyatigorsk',
    basePrice: 4,
    dateFrom: '2024-05-11T20:05:00.000Z',
    dateTo: '2024-05-11T21:19:00.000Z',
    destination: 'train-station-pyatigorsk',
    isFavorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
];
