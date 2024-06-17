import { render, remove, RenderPosition } from '../framework/render';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import ListEmptyView from '../view/list-empty';
import WaypointPresenter from './waypoint-presenter';
import { SORT_ITEMS } from '../utils/sort';
import { DEFAULT_SORT_ID, UpdateType, UserAction, /*DUMMY_WAYPOINT*/ } from '../constants';

export default class TripEventsPresenter {
  #container = null;

  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #tripEventsListComponent = new TripEventsListView();

  #waypointsPresenters = new Map();

  #selectedFilter = null;
  #selectedSorting = null;

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel}) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
    this.#selectedSorting = DEFAULT_SORT_ID;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    const sortItem = SORT_ITEMS.get(this.#selectedSorting);
    const sortedWaypoints = [...this.#waypointsModel.waypoints].sort(sortItem.sortFunction);
    return sortedWaypoints;
  }

  #clearList() {
    this.#waypointsPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenters.clear();

    remove(this.#sortComponent);
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }
  }

  #renderWaypoint(waypoint) {
    const waypointPresenterData = {
      waypointsListContainer: this.#tripEventsListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleWaypointModeChange,
    };
    const waypointPresenter = new WaypointPresenter(waypointPresenterData);

    waypointPresenter.init(waypoint);

    this.#waypointsPresenters.set(waypoint.id, waypointPresenter);
  }

  #renderWaypointsList() {
    //const createWaypointComponent = this.#createWaypointEditComponent(DUMMY_WAYPOINT);
    const sortedWaypoints = this.waypoints;

    if (sortedWaypoints.length === 0) {
      this.#renderEmptyListView(this.#selectedFilter);
      return;
    }

    this.#renderSortComponent();
    render(this.#tripEventsListComponent, this.#container);
    //const mockEditWaypointId = 'check-in-hotel-pyatigorsk';
    for (const waypoint of sortedWaypoints) {
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

  #handleViewAction = (actionType, updateType, update) => {
    //console.log('[TripEventsPresenter::handleViewAction]', update.isFavorite, update.id);
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      default:
        throw new Error('[TripEventsPresenter::handleViewAction] unknown action type');
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log('[TripEventsPresenter::handleModelEvent]');
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderWaypointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearList();
        this.init(this.#selectedFilter);
        break;
      default:
        throw new Error('[TripEventsPresenter::handleModelEvent] Unknown update type');
    }
  };

  #handleWaypointModeChange = () => {
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortId) => {
    this.#selectedSorting = sortId;
    this.#clearList();

    this.#renderWaypointsList();
  };

  init(selectedFilter) {
    this.#selectedFilter = selectedFilter;

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});

    this.#clearList();
    this.#renderWaypointsList();
  }
}
