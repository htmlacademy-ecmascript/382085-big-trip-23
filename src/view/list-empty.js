import AbstractView from '../framework/view/abstract-view';
import { FILTER_TO_MESSAGE_MAP } from '../utils/filter';


function createEmptyListMarkup(filterValue) {
  const message = FILTER_TO_MESSAGE_MAP.get(filterValue);
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyListView extends AbstractView {
  #filterValue;

  constructor(filterValue) {
    super();
    this.#filterValue = filterValue;
  }

  get template() {
    return createEmptyListMarkup(this.#filterValue);
  }
}
