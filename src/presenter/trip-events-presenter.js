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
  /** @type {import('../model/waypoints-model').default} */
  #waypointsModel = null;
  /** @type {import('../model/destinations-model').default} */
  #destinationsModel = null;
  /** @type {import('../model/offers-model').default} */
  #offersModel = null;
  /** @type {import('../model/filter-model').default} */
  #filterModel = null;

  /** @type {import('../view/sort').default} */
  #sortComponent = null;
  /** @type {import('../view/list-empty').default} */
  #emptyListComponent = null;
  #tripEventsListComponent = new TripEventsListView();

  /** @type {NewWaypointPresenter} */
  #newWaypointPresenter = null;
  /** @type {Map<string, WaypointPresenter>} */
  #waypointsPresenters = new Map();

  #handleNewWaypointClose = null;

  #selectedSorting = null;
  #isLoading = true;

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
    this.#handleSortTypeChange(DEFAULT_SORT_ID);
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
    if (this.#isLoading) {
      this.#emptyListComponent = new ListEmptyView('loading');
      this.#renderEmptyListComponent();
      return;
    }

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
    const sortedWaypoints = this.waypoints;

    render(this.#tripEventsListComponent, this.#container);
    for (const waypoint of sortedWaypoints) {
      this.#renderWaypoint(waypoint);
    }
  }

  #renderEmptyListComponent() {
    render(this.#emptyListComponent, this.#container);
  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  /**
   * @param {string} actionType
   * @param {string} updateType
   * @param {import('../constants').Waypoint} update
   */
  #handleViewAction = (actionType, updateType, update) => {
    //console.log('[TripEventsPresenter::handleViewAction]', actionType, updateType);
    //console.log(update);
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving(); // ???
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsPresenters.get(update.id).setDeleting(); // ???
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsPresenters.get(update.id).setSaving(); // ???
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      default:
        throw new Error('[TripEventsPresenter::handleViewAction] unknown action type');
    }
  };

  /**
   * @param {string} updateType
   * @param {import('../constants').Waypoint} data
   */
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
      case UpdateType.INIT:
        this.#isLoading = false;
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
