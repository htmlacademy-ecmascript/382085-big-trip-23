import { createElement } from '../render';


const SORTING_ITEMS = ['Day', 'Event', 'Time', 'Price', 'Offer'];
const MOCK_SELECTED_SORTING_ITEM = 'day';

function sortItem(sortName, checked) {
  const sortByLowerCase = sortName.toLowerCase();
  return `
    <div class="trip-sort__item  trip-sort__item--${sortByLowerCase}">
      <input id="sort-${sortByLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortByLowerCase}" ${checked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortByLowerCase}">${sortName}</label>
    </div>
  `;
}

function sort() {

  const itemsMarkupArray = [];
  for (const sortColumnName of SORTING_ITEMS) {
    const checked = sortColumnName.toLowerCase() === MOCK_SELECTED_SORTING_ITEM.toLowerCase();
    itemsMarkupArray.push(sortItem(sortColumnName, checked));
  }

  const innerMarkup = itemsMarkupArray.join(' ');
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get"> ${innerMarkup} </form>`;
}

export default class SortView {
  getTemplate() {
    return sort();
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
