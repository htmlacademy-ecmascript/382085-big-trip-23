import { render, RenderPosition } from './render';
import WaypointView from './view/waypoint';
import FilterView from './view/filter';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';

export default class TripEventsPresenter {
  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel }) {
    this.waypointsModel = waypointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.container = eventsContainer;
  }

  init() {
    const waypoints = this.waypointsModel.getWaypoints();

    render(new SortView(), this.container, RenderPosition.AFTERBEGIN);
    render(new EditWaypointView, this.container);

    for (let i = 0; i < waypoints.length; i += 1) {
      const destination = this.destinationsModel.getDestination(waypoints[i].destination);
      const offers = this.offersModel.getOffersForEventType(waypoints[i].type);
      render(new WaypointView({waypoint: waypoints[i], destination, offers}), this.container);
    }

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);
  }
}
