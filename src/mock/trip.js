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
export const TRIP_WAYPOINTS = [
  {
    id: 'taxi-airport-led',
    basePrice: 10,
    dateFrom: '2024-06-16T05:55:00.000Z',
    dateTo: '2024-06-16T06:30:00.000Z',
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
    dateFrom: '2024-06-16T07:40:00.000Z',
    dateTo: '2024-06-16T11:20:00.000Z',
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
    dateFrom: '2024-06-16T12:00:00.000Z',
    dateTo: '2024-06-16T12:50:00.000Z',
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
    dateFrom: '2024-06-16T12:55:00.000Z',
    dateTo: '2024-06-19T14:00:00.000Z',
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
    dateFrom: '2024-06-17T09:55:00.000Z',
    dateTo: '2024-06-17T11:04:00.000Z',
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
    dateFrom: '2024-06-17T11:15:00.000Z',
    dateTo: '2024-06-17T20:00:00.000Z',
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
    dateFrom: '2024-06-17T20:05:00.000Z',
    dateTo: '2024-06-17T21:19:00.000Z',
    destination: 'train-station-pyatigorsk',
    isFavorite: false,
    offers: [
      'train-meal'
    ],
    type: 'train'
  },
];
