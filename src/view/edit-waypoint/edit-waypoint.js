import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { createEventTypeSelectorMarkup } from './event-type-selector';
import { createDestinationMarkup } from './destination';
import { createOffersMarkup } from './offers-section';

import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';


/**
  * @param {import('../../constants').Waypoint} waypoint
  * @param {import('../../constants').Destination[]} destinations
  * @returns {string} разметка
  */
function createEditWaypointMarkup(waypoint, destinations, offers, disabled, saving, deleting) {

  const destination = destinations.find(({id}) => waypoint.destination === id);

  const offerListItem = offers.find((item) => item.type === waypoint.type);
  const offersForSelectedType = offerListItem.offers;

  const formId = waypoint.id || 0;

  const waypointTypeSelectorMarkup = createEventTypeSelectorMarkup(formId, waypoint.type, disabled);
  const destinationMarkup = createDestinationMarkup(destination);
  const offersMarkup = createOffersMarkup(waypoint, offersForSelectedType, disabled);

  const dataListMarkup = destinations.map(({name}) => `<option value="${name}"></option>`).join(' ');

  const rollupMarkup = (formId === 0) ? '' : (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`);

  let cancelButtonText = 'Cancel';
  if (formId) {
    cancelButtonText = 'Delete';
  } else if (deleting) {
    cancelButtonText = 'Deleting...';
  }

  const saveButtonText = saving ? 'Saving...' : 'Save';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

          ${waypointTypeSelectorMarkup}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${formId}">
              ${waypoint.type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${formId}"
              type="text"
              name="event-destination"
              value="${destination?.name ?? ''}"
              ${disabled ? 'disabled' : ''}
              list="destination-list-${formId}" />
            <datalist id="destination-list-${formId}">
              ${dataListMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${formId}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${formId}"
              type="text"
              name="event-start-time"
              ${disabled ? 'disabled' : ''}
              value="${waypoint.dateFrom}" />
            &mdash;
            <label class="visually-hidden" for="event-end-time-${formId}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${formId}"
              type="text"
              name="event-end-time"
              ${disabled ? 'disabled' : ''}
              value="${waypoint.dateTo}" />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${formId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${formId}"
              type="text"
              name="event-price"
              ${disabled ? 'disabled' : ''}
              value="${waypoint.basePrice}" />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${cancelButtonText}</button>
          ${rollupMarkup}
        </header>
        <section class="event__details">

          ${offersMarkup}

          ${destinationMarkup}

        </section>
      </form>
    </li>`
  );
}


export default class EditWaypointView extends AbstractStatefulView {

  /**
   * @param {import('../../constants').Waypoint} waypoint
   * @returns {Object} внутреннее состояние компонента
   */
  static convertDataToState(waypoint) {
    const state = {...waypoint};
    state.isDisabled = false;
    state.isSaving = false;
    state.isDeleting = false;
    state.basePrice = he.decode(String(waypoint.basePrice));
    state.dateFrom = he.decode(String(waypoint.dateFrom));
    state.dateTo = he.decode(String(waypoint.dateTo));
    state.offers = new Set(waypoint.offers);
    return state;
  }

  /**
   * @param {Object} state
   * @returns {import('../../constants').Waypoint} данные
   */
  static convertStateToData(state) {
    const waypoint = {...state};
    waypoint.basePrice = Number(he.encode(String(state.basePrice)));
    waypoint.dateFrom = he.encode(String(state.dateFrom));
    waypoint.dateTo = he.encode(String(state.dateTo));
    waypoint.offers = Array.from(state.offers);
    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;
    return waypoint;
  }

  #destinations = null;
  #offers = null;

  #handleFormSubmit = null;
  #handleFormCancel = null;
  #handleDeleteClicked = null;

  #startTimePicker = null;
  #endTimePicker = null;

  /**
   * @param {Object} param0
   * @param {import('../../constants').Waypoint} param0.waypoint
   * @param {import('../../constants').Destination[]} param0.destinations
   * @param {import('../../constants').OffersList} param0.offers
   * @param {Function} param0.onFormSubmit
   * @param {Function} param0.onFormCancel
   */
  constructor({waypoint, destinations, offers, onFormSubmit, onFormCancel, onWaypointDelete}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._state = EditWaypointView.convertDataToState(waypoint);
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCancel = onFormCancel;
    this.#handleDeleteClicked = onWaypointDelete;

    this._restoreHandlers();
  }

  _restoreHandlers() {

    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    // on input + debounce???
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeleteClicked);

    this.element.querySelectorAll('.event__offer-checkbox').forEach((item) => item.addEventListener('change', this.#onOffersChange));

    const eventTypeInputs = this.element.querySelectorAll('.event__type-input');
    eventTypeInputs.forEach((item) => {
      item.addEventListener('change', this.#onWaypointTypeChange);
    });

    this.element.querySelector('.event--edit').addEventListener('submit', this.#onFormSubmit);
    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormCancel);
    }

    this.#setTimePicker();
  }

  get template() {
    return createEditWaypointMarkup(this._state, this.#destinations, this.#offers, this._state.isDisabled);
  }

  removeElement() {
    super.removeElement();

    if (this.#startTimePicker) {
      this.#startTimePicker.destroy();
      this.#startTimePicker = null;
    }

    if (this.#endTimePicker) {
      this.#endTimePicker.destroy();
      this.#endTimePicker = null;
    }
  }

  reset(waypoint) {
    this.updateElement(EditWaypointView.convertDataToState(waypoint));
  }

  #setTimePicker() {
    this.#startTimePicker = flatpickr(
      this.element.querySelector('.event__input--time[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        time_24hr: true, // eslint-disable-line
        onChange: this.#onStartTimeChange,
        disable: [this.#disableStartTime]
      }
    );

    this.#endTimePicker = flatpickr(
      this.element.querySelector('.event__input--time[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        time_24hr: true, // eslint-disable-line
        onChange: this.#onEndTimeChange,
        disable: [this.#disableEndTime]
      }
    );
  }

  #disableStartTime = (time) => {
    const newMaxLimit = dayjs(time).add(15, 'minute').toDate();
    return dayjs(this._state.dateTo).isBefore(newMaxLimit);
  };

  #disableEndTime = (time) => {
    const newMinLimit = dayjs(time).subtract(15, 'minute').toDate();
    return dayjs(this._state.dateFrom).isAfter(newMinLimit);
  };

  #onOffersChange = (evt) => {
    if (evt.target.checked) {
      this._state.offers.add(evt.target.dataset.offer);
    } else {
      this._state.offers.delete(evt.target.dataset.offer);
    }

    this.updateElement({offers: this._state.offers});
  };

  #onWaypointTypeChange = (evt) => {
    const newType = evt.target.value;
    if (newType === this._state.type) {
      return;
    }
    this.updateElement({type: evt.target.value, offers: new Set()});
  };

  #onDestinationChange = (evt) => {
    const destinationFound = this.#destinations.find(({name}) => name === evt.target.value);
    // обновить блок с инфой про destination

    if (destinationFound) {
      this.updateElement({destination: destinationFound.id});
    }
  };

  #onStartTimeChange = ([time]) => {
    this._setState({dateFrom: time.toISOString()});
  };

  #onEndTimeChange = ([time]) => {
    this._setState({dateTo: time.toISOString()});
  };

  #onPriceInput = (evt) => {
    const value = Number(evt.target.value);
    if (!Number.isNaN(value) && Number.isFinite(value)) {
      this._setState({basePrice: value});
    }
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditWaypointView.convertStateToData(this._state));
  };

  #onFormCancel = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel();
  };

  #onDeleteClicked = (evt) => {
    evt.preventDefault();
    // По большому счёту, передача состояния тут не нужна, т.к. связей, по которым при удалении задачи
    // нужно удалять другие сущности, нет, и крмое waypoint.id нам ничего в модели не нужно. Здесь так
    // для того, чтобы понимать, что связи могут быть сложнее и удаляемый объект целиком может
    // потребоваться в модели.
    this.#handleDeleteClicked(EditWaypointView.convertStateToData(this._state));
  };
}
