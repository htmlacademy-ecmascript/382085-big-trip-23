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

    render(new SortView(), this.container, RenderPosition.AFTERBEGIN);
    render(new EditWaypointView, this.container);

    const waypoints = Array.from(this.waypointsModel.getWaypoints(), (item) => new WaypointView(item));
    for (const waypoint of waypoints) {
      render(waypoint, this.container);
    }

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);
  }
}
