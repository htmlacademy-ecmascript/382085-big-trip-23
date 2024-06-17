import FilterView from '../view/filter';
import FilterModel from '../model/filter-model';
import WaypointsModel from '../model/waypoints-model';
import { remove, render, replace } from '../framework/render';
import { UpdateType } from '../constants';
import { FILTERS_OBJECT } from '../utils/filter';


export default class FilterPresenter {
  #container = null;

  #waypointsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({container, waypointsModel, filterModel}) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const filtersMap = new Map();
    for (const [filterName, filterFunc] of Object.entries(FILTERS_OBJECT)) {
      const filtered = filterFunc(this.#waypointsModel.waypoints);
      filtersMap.set(filterName, filtered);
    }

    return filtersMap;
  }

  init() {
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
    if (this.#filterModel.filter !== newFilter) {
      this.#filterModel.setFilter(UpdateType.MAJOR, newFilter);
    }
  };

  #handleModelEvent = () => {
    this.init();
  };
}
