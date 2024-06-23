import FilterView from '../view/filter';
import { remove, render, replace } from '../framework/render';
import { UpdateType } from '../constants';
import { FILTERS_OBJECT } from '../utils/filter';


export default class FilterPresenter {
  #container = null;

  /** @type {import('../model/waypoints-model').default} */
  #waypointsModel = null;
  /** @type {import('../model/filter-model').default} */
  #filterModel = null;

  /** @type {FilterView} */
  #filterComponent = null;

  #disabled = false;

  constructor({filterContainer, waypointsModel, filterModel}) {
    this.#container = filterContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  /**
   * @returns {Map<string, import('../constants').Waypoint[]>}
   */
  get filters() {
    const filtersMap = new Map();
    if (this.#disabled) {
      return filtersMap;
    }
    for (const [filterName, filterFunc] of Object.entries(FILTERS_OBJECT)) {
      const filtered = filterFunc(this.#waypointsModel.waypoints);
      filtersMap.set(filterName, filtered);
    }

    return filtersMap;
  }

  init(status) {
    if (status === UpdateType.INIT_FAILED) {
      this.#disabled = true;
    } else {
      this.#disabled = false;
    }
    const prevFilterComponent = this.#filterComponent;

    const filterViewData = {
      filteredMap: this.filters,
      selectedFilter: this.#filterModel.filter,
      onFilterChange: this.#handleViewAction
    };

    this.#filterComponent = new FilterView(filterViewData);

    if (prevFilterComponent) {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
      return;
    }

    render(this.#filterComponent, this.#container);
  }

  #handleViewAction = (newFilter) => {
    if (this.#filterModel.filter !== newFilter && !this.#disabled) {
      this.#filterModel.setFilter(UpdateType.MAJOR, newFilter);
    }
  };

  #handleModelEvent = () => {
    this.init();
  };
}
