//import { editWaypoint } from 'view/edit-waypoint';
import { filter } from './view/filter';
import { sort } from './view/sort';
import { waypoint } from './view/waypoint';

const filterContainer = document.querySelector('.trip-controls__filters');
const filterMarkup = filter();
filterContainer.innerHTML = filterMarkup;

/**
* @typedef {Object} Offer
* @prop {string} title
* @prop {number} price
*/

/**
* @typedef {Object} WaypointData
* @prop {string} title
* @prop {Date} from
* @prop {Date} to
* @prop {number} price
* @prop {Offer[]} offers
*/
const WAYPOINT_DATA = {
  title: 'waypoint one',
  from: new Date('2024-06-01T12:00'),
  to: new Date('2024-06-09T12:00'),
  price: 150,
  offers: [
    { title: 'offer one', price: 150 },
    { title: 'offer two', price: 150 }
  ]
};

const eventsContainer = document.querySelector('.trip-events');
const sortMarkup = sort();
const waypointMarkup = waypoint(WAYPOINT_DATA);

eventsContainer.innerHTML = `${sortMarkup} ${waypointMarkup}`;

//editWaypoint();
