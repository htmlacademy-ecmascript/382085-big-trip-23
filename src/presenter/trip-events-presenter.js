import { render, remove, RenderPosition } from '../framework/render';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import ListEmptyView from '../view/list-empty';
import WaypointPresenter from './waypoint-presenter';
import NewWaypointPresenter from './new-waypoint-presenter';
import { SORT_ITEMS } from '../utils/sort';
import { DEFAULT_SORT_ID, UpdateType, UserAction } from '../constants';
import { FILTERS_OBJECT } from '../utils/filter';

export default class TripEventsPresenter {
  #container = null;

  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #tripEventsListComponent = new TripEventsListView();
  #newWaypointPresenter = null;

  #waypointsPresenters = new Map();

  #handleNewWaypointClose = null;

  #selectedSorting = null;

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel, filterModel, onNewWaypointClose}) {
    this.#container = eventsContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#selectedSorting = DEFAULT_SORT_ID;
    this.#handleNewWaypointClose = onNewWaypointClose;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    const filter = this.#filterModel.filter;
    const filteredTasks = FILTERS_OBJECT[filter]([...this.#waypointsModel.waypoints]);

    const sortItem = SORT_ITEMS.get(this.#selectedSorting);
    const sortedWaypoints = filteredTasks.sort(sortItem.sortFunction);

    return sortedWaypoints;
  }

  createNewWaypoint() {
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
    const newWaypointPresenterData = {
      container: this.#tripEventsListComponent.element,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleViewAction,
      offers: this.#offersModel.offers,
      onNewWaypointClose: this.#onNewWaypointClose,
    };
    this.#newWaypointPresenter = new NewWaypointPresenter(newWaypointPresenterData);

    this.#newWaypointPresenter.init();
  }

  #clearAll() {
    this.#waypointsPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointsPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }
    // ????
    if (this.#newWaypointPresenter) {
      this.#newWaypointPresenter.destroy();
      this.#newWaypointPresenter = null;
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

  #renderAll() {
    const sortedWaypoints = this.waypoints;

    if (sortedWaypoints.length === 0) {
      this.#emptyListComponent = new ListEmptyView(this.#filterModel.filter);
      this.#renderEmptyListComponent();
      return;
    }

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange, selectedSorting: this.#selectedSorting});
    this.#renderSortComponent();

    this.#renderWaypointsList();
  }

  #renderWaypointsList() {
    //const createWaypointComponent = this.#createWaypointEditComponent(DUMMY_WAYPOINT);
    const sortedWaypoints = this.waypoints;

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

  #renderEmptyListComponent() {
    render(this.#emptyListComponent, this.#container);
  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = (actionType, updateType, update) => {
    //console.log('[TripEventsPresenter::handleViewAction]', actionType, updateType);
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
    //console.log('[TripEventsPresenter::handleModelEvent]', updateType);
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.init();
        break;
      case UpdateType.MAJOR:
        this.init();
        break;
      default:
        throw new Error('[TripEventsPresenter::handleModelEvent] Unknown update type');
    }
  };

  #handleWaypointModeChange = () => {
    if (this.#newWaypointPresenter) {
      this.#newWaypointPresenter.destroy();
    }
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortId) => {
    this.#selectedSorting = sortId;

    this.init();
  };

  #onNewWaypointClose = () => {
    this.#handleNewWaypointClose();
  };

  init() {
    this.#clearAll();
    this.#renderAll();
  }
}
