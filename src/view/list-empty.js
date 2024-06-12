import AbstractView from '../framework/view/abstract-view';

const FILTER_TO_MESSAGE = new Map([
  ['everything', 'Click New Event to create your first point'],
  ['past', 'There are no past events now'],
  ['present', 'There are no present events now'],
  ['future', 'There are no future events now'],
]);

function createEmptyListMarkup(filterValue) {
  const message = FILTER_TO_MESSAGE.get(filterValue);
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
