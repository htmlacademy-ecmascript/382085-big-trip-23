import AbstractView from '../framework/view/abstract-view';
import { FilterType, filter } from '../utils/filter';

/**
* @param {string} filterName
* @param {boolean} selected
* @param {boolean} enabled
* @returns {string} markup
*/
function createFilterItemMarkup(filterName, selected, enabled) {
  const filterNameLowerCase = filterName.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input id="filter-${filterNameLowerCase}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filterNameLowerCase}" ${selected ? 'checked' : ''} ${enabled ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${filterNameLowerCase}">${filterName}</label>
    </div>`;
}

/**
* @param {Map<string, import('../mock/trip').Waypoint[]>} filteredMap
* @param {string} selectedFilter
* @returns {string}
*/
function createFilterMarkup(filteredMap, selectedFilter) {

  const itemsMarkupArray = Object.values(FilterType).map((filterName) => {
    const enabled = filteredMap.has(filterName) && (filteredMap.get(filterName).length > 0);
    const selected = filterName === selectedFilter;
    return createFilterItemMarkup(filterName, selected, enabled);
  });

  const filterItemsMarkup = itemsMarkupArray.join(' ');

  return `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filterItemsMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
}

export default class FilterView extends AbstractView {
  #filteredMap = null;
  #selectedFilter = null;

  constructor({waypoints, selectedFilter}) {
    super();
    this.#filteredMap = new Map();
    for (const [filterName, filterFunc] of Object.entries(filter)) {
      const filtered = filterFunc(waypoints);
      this.#filteredMap.set(filterName, filtered);
    }

    this.#selectedFilter = selectedFilter;
  }

  get template() {
    return createFilterMarkup(this.#filteredMap, this.#selectedFilter);
  }
}
