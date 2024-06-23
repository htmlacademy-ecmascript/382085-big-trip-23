import { render, remove, RenderPosition } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import SortView from '../view/sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import ListEmptyView from '../view/empty-list-view';
import WaypointPresenter from './waypoint-presenter';
import NewWaypointPresenter from './new-waypoint-presenter';
import { DEFAULT_SORT_ID, UpdateType, UserAction } from '../constants';
import { SORT_ITEMS } from '../utils/sort';
import { FILTERS } from '../utils/filter';
import { forkJoinObservables } from '../utils/common';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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

  /** @type {import('../view/sort-view').default} */
  #sortComponent = null;
  /** @type {import('../view/empty-list-view').default} */
  #emptyListComponent = null;
  #tripEventsListComponent = new TripEventsListView();

  /** @type {NewWaypointPresenter} */
  #newWaypointPresenter = null;
  /** @type {Map<string, WaypointPresenter>} */
  #waypointsPresenters = new Map();

  #handleNewWaypointClose = null;

  #selectedSorting = null;
  #isLoading = true;

  #uiBlocker = new UiBlocker({lowerLimit: TimeLimit.LOWER_LIMIT, upperLimit: TimeLimit.UPPER_LIMIT});

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel, filterModel, onNewWaypointClose}) {
    this.#container = eventsContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#selectedSorting = DEFAULT_SORT_ID;
    this.#handleNewWaypointClose = onNewWaypointClose;

    forkJoinObservables([this.#waypointsModel, this.#destinationsModel, this.#offersModel], this.#handleModelEvent);

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    const filterId = this.#filterModel.filter;
    const filteredWaypoints = FILTERS[filterId]([...this.#waypointsModel.waypoints]);

    const sortItem = SORT_ITEMS.get(this.#selectedSorting);
    const sortedWaypoints = filteredWaypoints.sort(sortItem.sortFunction);

    return sortedWaypoints;
  }

  createNewWaypoint() {
    this.#selectedSorting = DEFAULT_SORT_ID;
    this.#handleSortTypeChange(this.#selectedSorting);
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
      render(this.#tripEventsListComponent, this.#container);
    }
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
  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch (err) {
          this.#newWaypointPresenter.setAborting();
        }
        this.#handleNewWaypointClose();
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch (err) {
          this.#waypointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsPresenters.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch (err) {
          this.#waypointsPresenters.get(update.id).setAborting();
        }
        break;
      default:
        throw new Error('[TripEventsPresenter::handleViewAction] unknown action type');
    }
    this.#uiBlocker.unblock();
  };

  /**
   * @param {string} updateType
   * @param {import('../constants').Waypoint} data
   */
  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.init();
        break;
      case UpdateType.MAJOR:
        this.#selectedSorting = DEFAULT_SORT_ID;
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.init();
        break;
      case UpdateType.INIT_FAILED:
        this.#isLoading = false;
        remove(this.#emptyListComponent);
        this.#emptyListComponent = new ListEmptyView('failed');
        this.#renderEmptyListComponent();
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
    if (this.waypoints.length === 0) {
      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }
      if (this.#tripEventsListComponent) {
        remove(this.#tripEventsListComponent);
      }
      if (this.#emptyListComponent) {
        remove(this.#emptyListComponent);
      }

      this.#emptyListComponent = new ListEmptyView(this.#filterModel.filter);
      this.#renderEmptyListComponent();
    }
  };

  init() {
    this.#clearAll();
    this.#renderAll();
  }
}
