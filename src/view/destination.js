import { createElement } from '../render';

/**
* @param {import('../mock/destinations').Destination} destination
  * @returns {string} разметка
*/
function createDestinationMarkup(destination) {

  const picturesMarkup = destination.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join(' ');

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${destination.description}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesMarkup}
        </div>
      </div>
    </section>`;
}

export default class DestinationView {

  constructor(destination) {
    this.destination = destination;
  }

  getTemplate() {
    return createDestinationMarkup(this.destination);
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
