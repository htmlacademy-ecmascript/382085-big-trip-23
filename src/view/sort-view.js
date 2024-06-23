import AbstractView from '../framework/view/abstract-view';
import { SORT_ITEMS } from '../utils/sort';

/**
  * @param {Object} param0
  * @param {string} param0.title название критерия сортировки
  * @param {boolean} param0.canSort возможна ли сортировка по этому критерию
  * @param {string} id id критерия сортировки
  * @param {boolean} checked выбран ли этот пункт
  * @returns {string} разметка
  */
function createSortItemMarkup({title, canSort}, id, checked) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${id}">
      <input
        id="sort-${id}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${id}"
        ${canSort ? '' : 'disabled'}
        ${checked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${id}">${title}</label>
    </div>`
  );
}

function createSortMarkup(selectedSorting) {
  const sortItems = [];
  SORT_ITEMS.forEach((sortItem, sortId) => sortItems.push(createSortItemMarkup(sortItem, sortId, sortId === selectedSorting)));
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortItems.join(' ')}</form>`;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  #selectedSorting = null;

  constructor({onSortTypeChange, selectedSorting}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#selectedSorting = selectedSorting;

    const enabledSortItems = this.element.querySelectorAll('.trip-sort__input:not([disabled])');
    enabledSortItems.forEach((item) => item.addEventListener('change', this.#onSortTypeChange));
  }

  get template() {
    return createSortMarkup(this.#selectedSorting);
  }

  #onSortTypeChange = (evt) => {
    const sortItemId = evt.target.value.replace('sort-', '');
    this.#handleSortTypeChange(sortItemId);
  };
}
