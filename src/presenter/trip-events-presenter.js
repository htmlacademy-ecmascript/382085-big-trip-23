import { render, RenderPosition } from '../framework/render';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import ListEmptyView from '../view/list-empty';
import WaypointPresenter from './waypoint-presenter';
//import { DUMMY_WAYPOINT } from './constants';

export default class TripEventsPresenter {
  #container = null;

  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortComponent = new SortView();
  #tripEventsListComponent = new TripEventsListView();

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel }) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
  }

  #renderWaypoint(waypoint) {
    const waypointPresenterData = {
      waypointsListContainer: this.#tripEventsListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    };
    const waypointPresenter = new WaypointPresenter(waypointPresenterData);

    waypointPresenter.init(waypoint);
  }

  #renderWaypointsList(waypoints, selectedFilter) {
    //const createWaypointComponent = this.#createWaypointEditComponent(DUMMY_WAYPOINT);

    if (waypoints.length === 0) {
      this.#renderEmptyListView(selectedFilter);
      return;
    }

    this.#renderSortComponent();
    render(this.#tripEventsListComponent, this.#container);
    //const mockEditWaypointId = 'check-in-hotel-pyatigorsk';
    for (const waypoint of waypoints) {
      //if (waypoint.id === mockEditWaypointId) {
      //  this.#createWaypointComponent(waypoint);
      //} else {
      //  this.#renderWaypoint(waypoint);
      //}
      this.#renderWaypoint(waypoint);
    }
  }

  #renderEmptyListView(selectedFilter) {
    const comp = new ListEmptyView(selectedFilter);
    render(comp, this.#container);
  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  init(selectedFilter) {
    const waypoints = this.#waypointsModel.waypoints;

    this.#renderWaypointsList(waypoints, selectedFilter);
  }
}
