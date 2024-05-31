import { DEFAULT_SORT_ITEM_INDEX, SORT_ITEMS } from '../../constants';
import { createElement } from '../render';

/**
  * @param {string} sortName
  */
function createSortItemMarkup({title, canSort}, checked) {
  const sortNameLowerCase = title.toLowerCase();
  return `
    <div class="trip-sort__item  trip-sort__item--${sortNameLowerCase}">
      <input id="sort-${sortNameLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortNameLowerCase}" ${canSort ? '' : 'disabled'} ${checked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortNameLowerCase}">${title}</label>
    </div>`;
}

function createSortMarkup() {

  const innerMarkup = SORT_ITEMS.map((sortItem, idx) => createSortItemMarkup(sortItem, idx === DEFAULT_SORT_ITEM_INDEX)).join(' ');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get"> ${innerMarkup} </form>`;
}

export default class SortView {
  getTemplate() {
    return createSortMarkup();
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
