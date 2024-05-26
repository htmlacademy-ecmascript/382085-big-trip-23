import { render, RenderPosition } from './render';
import WaypointView from './view/waypoint';
import FilterView from './view/filter';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';

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


export default class TripEventsPresenter {
  constructor({eventsContainer}) {
    this.container = eventsContainer;
  }

  init() {

    render(new SortView(), this.container, RenderPosition.AFTERBEGIN);
    render(new EditWaypointView, this.container);

    const waypoints = Array.from(WAYPOINT_DATA, (item) => new WaypointView(item));
    for (const waypoint of waypoints) {
      render(waypoint, this.container);
    }

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);
  }
}
