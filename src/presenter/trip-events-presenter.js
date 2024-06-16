import { render, RenderPosition } from '../framework/render';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import ListEmptyView from '../view/list-empty';
import WaypointPresenter from './waypoint-presenter';
import { SORT_ITEMS } from '../utils/sort';
//import { DUMMY_WAYPOINT } from './constants';

export default class TripEventsPresenter {
  #container = null;

  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortComponent = null;
  #tripEventsListComponent = new TripEventsListView();

  #waypointsPresenters = new Map();

  #selectedFilter = null;

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel}) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
  }

  #clearWaypointsList() {
    this.#waypointsPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenters.clear();
    //this.#renderEmptyListView();
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

  #renderWaypointsList(waypoints) {
    //const createWaypointComponent = this.#createWaypointEditComponent(DUMMY_WAYPOINT);

    if (waypoints.length === 0) {
      this.#renderEmptyListView(this.#selectedFilter);
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

  #renderEmptyListView() {
    const comp = new ListEmptyView(this.#selectedFilter);
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

  #handleSortTypeChange = (sortId) => {
    this.#clearWaypointsList();
    const sortItem = SORT_ITEMS.get(sortId);
    const sortedWaypoints = [...this.#waypointsModel.waypoints].sort(sortItem.sortFunction);

    this.#renderWaypointsList(sortedWaypoints, this.#selectedFilter);
  };

  init(selectedFilter) {
    this.#selectedFilter = selectedFilter;
    const waypoints = this.#waypointsModel.waypoints;

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});

    this.#renderWaypointsList(waypoints);
  }
}
