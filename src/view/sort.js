import { DEFAULT_SORT_ITEM_INDEX, SORT_ITEMS } from '../constants';
import AbstractView from '../framework/view/abstract-view';

/**
  * @param {Object} param0
  * @param {string} param0.title название критерия сортировки
  * @param {boolean} param0.canSort возможна ли сортировка по этому критерию
  * @param {boolean} checked выбран ли этот пункт
  * @returns {string} разметка
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
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${innerMarkup}</form>`;
}

export default class SortView extends AbstractView {
  get template() {
    return createSortMarkup();
  }
}
