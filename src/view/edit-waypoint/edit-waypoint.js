import AbstractView from '../../framework/view/abstract-view';
import { createEventTypeSelectorMarkup } from './event-type-selector';
import { createDestinationMarkup } from './destination';
import { createOffersMarkup } from './offers-section';


/**
  * @param {import('../mock/trip').Waypoint} waypoint
  * @param {import('../mock/destinations').Destination[]} destinations
  * @returns {string} разметка
  */
function createEditWaypointMarkup(waypoint, destinations, offers) {

  const destination = destinations.find(({id}) => waypoint.destination === id);

  const offerListItem = offers.find((item) => item.type === waypoint.type);
  const offersForSelectedType = offerListItem.offers;

  const formId = waypoint.id || 0;

  const waypointTypeSelectorMarkup = createEventTypeSelectorMarkup(formId, waypoint.type);
  const destinationMarkup = createDestinationMarkup(destination);
  const offersMarkup = createOffersMarkup(waypoint, offersForSelectedType);

  const dataListMarkup = destinations.map(({name}) => `<option value="${name}"></option>`).join(' ');
  const rollupMarkup = `
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

          ${waypointTypeSelectorMarkup}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${formId}">
              ${waypoint.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${formId}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${formId}" />
            <datalist id="destination-list-${formId}">
              ${dataListMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${formId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${formId}" type="text" name="event-start-time" value="${waypoint.dateFrom}" />
            &mdash;
            <label class="visually-hidden" for="event-end-time-${formId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${formId}" type="text" name="event-end-time" value="${waypoint.dateTo}" />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${formId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${formId}" type="text" name="event-price" value="${waypoint.basePrice}" />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${formId ? 'Delete' : 'Cancel'}</button>
          ${formId ? rollupMarkup : ''}
        </header>
        <section class="event__details">

          ${offersMarkup}

          ${destinationMarkup}

        </section>
      </form>
    </li>
  `;
}


export default class EditWaypointView extends AbstractView {
  #waypoint = null;
  #destinations = [];
  #offers = [];

  #handleFormSubmit = null;
  #handleFormCancel = null;

  constructor({waypoint, destinations, offers, onFormSubmit, onFormCancel}) {
    super();
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCancel = onFormCancel;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormCancel);
  }

  get template() {
    return createEditWaypointMarkup(this.#waypoint, this.#destinations, this.#offers);
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#waypoint);
  };

  #onFormCancel = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel?.();
  };
}
