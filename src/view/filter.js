import { createElement } from '../render';

const FILTERS = ['Everything', 'Future', 'Present', 'Past'];
const MOCK_SELECTED_FILTER = 'everything';

function filterItem(filterName, checked) {
  const filterNameLowerCase = filterName.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input id="filter-${filterNameLowerCase}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filterNameLowerCase}" ${checked ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterNameLowerCase}">${filterName}</label>
    </div>
  `;
}

function filter() {

  const itemsMarkupArray = [];
  for (const filterName of FILTERS) {
    const checked = filterName.toLowerCase() === MOCK_SELECTED_FILTER.toLowerCase();
    itemsMarkupArray.push(filterItem(filterName, checked));
  }

  const filtersMarkup = itemsMarkupArray.join(' ');

  return `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
  `;

}

export default class FilterView {
  getTemplate() {
    return filter();
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
