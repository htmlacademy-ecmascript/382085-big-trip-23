import { DEFAULT_FILTER_ITEM_INDEX, FILTER_ITEMS } from '../../constants';
import { createElement } from '../render';

function createFilterItemMarkup(filterName, active) {
  const filterNameLowerCase = filterName.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input id="filter-${filterNameLowerCase}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filterNameLowerCase}" ${active ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterNameLowerCase}">${filterName}</label>
    </div>
  `;
}

function createFilterMarkup() {

  const itemsMarkupArray = FILTER_ITEMS.map((filter, i) => createFilterItemMarkup(filter, i === DEFAULT_FILTER_ITEM_INDEX));

  const filtersMarkup = itemsMarkupArray.join(' ');

  return `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
}

export default class FilterView {
  getTemplate() {
    return createFilterMarkup();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
