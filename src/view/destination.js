import AbstractView from '../framework/view/abstract-view';

/**
  * @param {Object} param0
  * @param {import('../mock/destinations').PictureData[]} param0.pictures
  * @returns {string} разметка
  */
function createPicturesMarkup({pictures}) {

  if (pictures?.length === 0) {
    return '';
  }

  const picturesMarkup = pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join(' ');

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesMarkup}
      </div>
    </div>`;
}

/**
* @param {import('../mock/destinations').Destination} destination
* @returns {string} разметка
*/
function createDestinationMarkup(destination) {

  if (!destination) {
    return '';
  }

  let descriptionMarkup = '';
  if (destination.description && destination.description.length > 0) {
    descriptionMarkup = `
      <p class="event__destination-description">
        ${destination.description}
      </p>`;
  }

  const picturesMarkup = createPicturesMarkup(destination);

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionMarkup}
      ${picturesMarkup}
    </section>`;
}

export default class DestinationView extends AbstractView {
  #destination = null;

  constructor(destination) {
    super();
    this.#destination = destination;
  }

  get template() {
    return createDestinationMarkup(this.#destination);
  }
}
