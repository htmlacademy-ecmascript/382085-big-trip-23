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
    id: 'airport-led',
    description: 'Pulkovo airport',
    name: 'Pulkovo airport',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
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
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
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
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
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
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
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
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Kislovodsk park'
      }
    ]
  }
];
