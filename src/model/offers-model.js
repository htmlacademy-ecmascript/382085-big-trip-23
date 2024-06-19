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
    } catch (err) {
      //console.error(err);
      this.#offers = [];
      this._notify(UpdateType.INIT_FAILED, this.#offers);
      return;
    }
    this._notify(UpdateType.INIT, this.#offers);
  }
}
