import { DEFAULT_SORT_ID } from '../constants';
import { SORT_ITEMS } from '../utils/sort';
import AbstractView from '../framework/view/abstract-view';

/**
  * @param {Object} param0
  * @param {string} param0.title название критерия сортировки
  * @param {boolean} param0.canSort возможна ли сортировка по этому критерию
  * @param {string} id id критерия сортировки
  * @param {boolean} checked выбран ли этот пункт
  * @returns {string} разметка
  */
function createSortItemMarkup({title, canSort}, id, checked) {
  return `
    <div class="trip-sort__item  trip-sort__item--${id}">
      <input
        id="sort-${id}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${id}"
        ${canSort ? '' : 'disabled'}
        ${checked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${id}">${title}</label>
    </div>`;
}

function createSortMarkup() {
  const innerMarkup = [];
  SORT_ITEMS.forEach((sortItem, sortId) => innerMarkup.push(createSortItemMarkup(sortItem, sortId, sortId === DEFAULT_SORT_ID)));
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${innerMarkup.join(' ')}</form>`;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    const enabledSortItems = this.element.querySelectorAll('.trip-sort__input:not([disabled])');
    enabledSortItems.forEach((item) => item.addEventListener('change', (evt) => this.onSortTypeChange(evt)));
  }

  get template() {
    return createSortMarkup();
  }

  onSortTypeChange = (evt) => {
    const sortItemId = evt.target.value.replace('sort-', '');
    this.#handleSortTypeChange(sortItemId);
  };
}
