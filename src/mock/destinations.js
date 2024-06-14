/** @type import("./trip").WaypointType[] */
export const EVENT_TYPES = ['check-in', 'sightseeing', 'restaurant', 'taxi', 'bus', 'train', 'ship', 'drive', 'flight'];

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


// GET /big-trip/destinations
/** @type Destination[] */
export const DESTINATIONS = [
  {
    id: 'airport-mrv',
    description: 'Mineral\'niye Vody airport',
    name: 'Mineral\'niye Vody airport',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Mineral\'niye Vody airport'
      }
    ]
  },
  {
    id: 'airport-led',
    description: 'Pulkovo airport',
    name: 'Pulkovo airport',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Pulkovo airport'
      }
    ]
  },
  {
    id: 'hotel-pyatigorsk',
    description: 'Hotel Intourist in Pyatigorsk',
    name: 'Intourist',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Intourist'
      }
    ]
  },
  {
    id: 'train-station-kislovodsk',
    description: 'Kislovodsk town railroad station',
    name: 'Kislovodsk railroad station',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Kislovodsk railroad station'
      }
    ]
  },
  {
    id: 'train-station-pyatigorsk',
    description: 'Pyatigorsk railroad station',
    name: 'Pyatigorsk railroad station',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Pyatigorsk station'
      }
    ]
  },
  {
    id: 'kislovodsk-park',
    description: 'Kislovodsk town park',
    name: 'Kislovodsk park',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200',
        description: 'Kislovodsk park'
      }
    ]
  }
];
