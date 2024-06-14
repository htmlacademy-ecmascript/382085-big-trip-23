import { createElement } from '../render';

const EVENTS_RADIO_OPTIONS = [
  { id: 'taxi', text: 'Taxi' },
  { id: 'bus', text: 'Bus' },
  { id: 'train', text: 'Train' },
  { id: 'ship', text: 'Ship' },
  { id: 'drive', text: 'Drive' },
  { id: 'flight', text: 'Flight' },
  { id: 'check-in', text: 'Check-in' },
  { id: 'sightseeing', text: 'Sightseeing' },
  { id: 'restaurant', text: 'Restaurant' },
];


function createEventOption({id, text}) {
  return `
    <div class="event__type-item">
      <input id="event-type-${id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${id}" />
      <label class="event__type-label  event__type-label--${id}" for="event-type-${id}-1">${text}</label>
    </div>
    `;
}

const OFFERS_OPTIONS = [
  { id: 'luggage', text: 'Add luggage', price: 50 },
  { id: 'comfort', text: 'Switch to comfort', price: 80 },
  { id: 'meal', text: 'Add meal', price: 15 },
  { id: 'seats', text: 'Choose seats', price: 5 },
  { id: 'train', text: 'Travel by train', price: 40 },
];

const SELECTED_OFFERS = new Set(['luggage','comfort']);

function createOptionMarkup({id, text, price}) {
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${SELECTED_OFFERS.has(id) ? 'checked' : ''}/>
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${text}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
    `;
}


function editWaypoint() {

  const radioItems = Array.from(EVENTS_RADIO_OPTIONS, (option) => createEventOption(option));
  const eventsMarkup = radioItems.join(' ');

  const offersItems = Array.from(OFFERS_OPTIONS, (option) => createOptionMarkup(option));
  const offersMarkup = offersItems.join(' ');

  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon" />
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" />

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventsMarkup}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          Flight
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1" />
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25" />
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35" />
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160" />
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersMarkup}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
      </section>
    </section>
  </form>
  </li>
  `;
}


export default class EditWaypointView {
  getTemplate() {
    return editWaypoint();
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
