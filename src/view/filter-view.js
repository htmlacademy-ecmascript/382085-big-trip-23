import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../utils/filter';

/**
* @param {string} filterName
* @param {boolean} selected
* @param {boolean} enabled
* @returns {string} markup
*/
function createFilterItemMarkup(filterName, selected, enabled) {
  const filterNameLowerCase = filterName.toLowerCase();
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${filterNameLowerCase}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterNameLowerCase}"
        ${selected ? 'checked' : ''}
        ${enabled ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${filterNameLowerCase}">${filterName}</label>
    </div>`
  );
}

/**
* @param {Map<string, import('../constants').Waypoint[]>} filteredMap
* @param {string} selectedFilter
* @returns {string}
*/
function createFilterMarkup(filteredMap, selectedFilter) {

  const filterItems = Object.values(FilterType).map((filterName) => {
    const enabled = filteredMap.has(filterName) && (filteredMap.get(filterName).length > 0);
    const selected = filterName === selectedFilter;
    return createFilterItemMarkup(filterName, selected, enabled);
  });

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems.join(' ')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filteredMap = null;
  #selectedFilter = null;

  #handleFilterChange = null;

  constructor({filteredMap, selectedFilter, onFilterChange}) {
    super();
    this.#filteredMap = filteredMap;
    this.#handleFilterChange = onFilterChange;
    this.#selectedFilter = selectedFilter;

    this.element.querySelectorAll('.trip-filters__filter-input').forEach((filterInput) =>
      filterInput.addEventListener('change', this.#onFilterChange)
    );
  }

  #onFilterChange = (evt) => {
    if (!evt.target.disabled
      && (evt.target.value !== this.#selectedFilter)) {
      this.#selectedFilter = evt.target.value;
      this.#handleFilterChange(this.#selectedFilter);
    }
  };

  get template() {
    return createFilterMarkup(this.#filteredMap, this.#selectedFilter);
  }
}
