import { UpdateType } from '../constants';
import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  /** @type {import('../constants').OffersList} */
  #offers = [];

  #apiService = null;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  /**
  * @param {import('../constants').WaypointType} eventType тип точки путешествия
  * @returns {import('../constants').Offer[]} массив предложений
  */
  getOffersForEventType(eventType) {
    const offerListItem = this.#offers.find((item) => item.type === eventType);
    return offerListItem.offers;
  }

  async init() {
    try {
      this.#offers = await this.#apiService.offers;
      // Debug
//      this.#offers = [ { "type": "taxi", "offers": [ { "id": "taxi-1", "title": "Taxi offer #1", "price": 100 }, { "id": "taxi-2", "title": "Taxi offer #2", "price": 10 }, { "id": "taxi-3", "title": "Taxi offer #3", "price": 1 }, { "id": "taxi-4", "title": "Taxi offer #4", "price": 1000 }, { "id": "taxi-5", "title": "Taxi offer #5", "price": 1000 } ] },
//  { "type": "bus", "offers": [ { "id": "bus-1", "title": "Bus offer #1", "price": 100 } ] },
//  { "type": "train", "offers": [ { "id": "train-1", "title": "Train Offer #1", "price": 100 } ] },
//  { "type": "flight", "offers": [ { "id": "flight-1", "title": "Flight Offer #1", "price": 190 } ] },
//  { "type": "check-in", "offers": [ { "id": "check-in-1", "title": "Check-in Offer #1", "price": 100 } ] },
//  { "type": "sightseeing", "offers": [] },
//  { "type": "ship", "offers": [ { "id": "ship-1", "title": "Ship Offer #1", "price": 100 } ] },
//  { "type": "drive", "offers": [ { "id": "drive-1", "title": "Drive Offer #1", "price": 100 } ] },
//  { "type": "restaurant", "offers": [ { "id": "restaurant-1", "title": "Restaurant Offer #1", "price": 100 } ] } ]
//
    } catch (err) {
      this.#offers = [];
      this._notify(UpdateType.INIT_FAILED, this.#offers);
      console.log('offers model init failed');
      return;
    }
    this._notify(UpdateType.INIT, this.#offers);
  }
}
