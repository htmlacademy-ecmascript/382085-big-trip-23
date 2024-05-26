import { RenderPosition, render } from './render.js';
import TripEventsPresenter from './trip-events-presenter';
import { TripInfoView } from './view/trip-info';

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

// mock data
const WAYPOINT_DATA = [
  {
    title: 'waypoint one',
    from: new Date('2024-06-01T12:00'),
    to: new Date('2024-06-09T12:00'),
    price: 150,
    offers: [
      { title: 'offer one', price: 150 },
      { title: 'offer two', price: 150 }
    ]
  },{
    title: 'waypoint two',
    from: new Date('2024-06-01T12:00'),
    to: new Date('2024-06-09T12:00'),
    price: 150,
    offers: [
      { title: 'offer one', price: 150 },
      { title: 'offer two', price: 150 }
    ]
  },
  {
    title: 'waypoint three',
    from: new Date('2024-06-01T12:00'),
    to: new Date('2024-06-09T12:00'),
    price: 150,
    offers: [
      { title: 'offer one', price: 150 },
      { title: 'offer two', price: 150 }
    ]
  }
];

const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const eventsPresenter = new TripEventsPresenter({eventsContainer});

eventsPresenter.init();

