import AbstractView from '../framework/view/abstract-view';
import { STATE_TO_MESSAGE_MAP } from '../utils/filter';


function createEmptyListMarkup(reason) {
  const message = STATE_TO_MESSAGE_MAP.get(reason);
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyListView extends AbstractView {
  /** @type {string} */
  #reason;

  constructor(reason) {
    super();
    this.#reason = reason;
  }

  get template() {
    return createEmptyListMarkup(this.#reason);
  }
}
