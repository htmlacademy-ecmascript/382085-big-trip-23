export default class OffersModel {
  #offers = [];

  #apiService = null;

  constructor({apiService}) {
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  /**
  * @param {import('../mock/trip').WaypointType} eventType тип точки путешествия
  * @returns {import('../mock/offers').Offer[]} массив предложений
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
