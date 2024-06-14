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

  #waypointsPresenters = new Map();

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel}) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
  }

  #clearWaypointsList() {
    this.#waypointsPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenters.clear();
    this.#renderEmptyListView();
  }

  #renderWaypoint(waypoint) {
    const waypointPresenterData = {
      waypointsListContainer: this.#tripEventsListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleUpdateWaypoint,
      onModeChange: this.#handleWaypointModeChange,
    };
    const waypointPresenter = new WaypointPresenter(waypointPresenterData);

    waypointPresenter.init(waypoint);

    this.#waypointsPresenters.set(waypoint.id, waypointPresenter);
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

  #handleUpdateWaypoint = (waypoint) => {
    // нет сохранённых точек, поэтому нечего обновлять
    this.#waypointsPresenters.get(waypoint.id).init(waypoint);
  };

  #handleWaypointModeChange = () => {
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };

  init(selectedFilter) {
    const waypoints = this.#waypointsModel.waypoints;

    this.#renderWaypointsList(waypoints, selectedFilter);
  }
}
