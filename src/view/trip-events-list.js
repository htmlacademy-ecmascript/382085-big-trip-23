import { createElement } from '../render';

function createTripEventsListMarkup() {
  return '<ul class="trip-events__list"> </ul>';
}

export default class TripEventsListView {

  getTemplate() {
    return createTripEventsListMarkup();
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
