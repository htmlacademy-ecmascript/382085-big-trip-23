import { DEFAULT_FILTER_ITEM_INDEX, FILTER_ITEMS } from '../constants';
import AbstractView from '../framework/view/abstract-view';

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
  get template() {
    return createFilterMarkup();
  }
}
