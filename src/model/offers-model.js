export default class OffersModel {
  /** @type {import('../constants').OffersList} */
  #offers = [];

  #apiService = null;

  constructor({apiService}) {
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
      this.#offers = [];
    }
  }
}
