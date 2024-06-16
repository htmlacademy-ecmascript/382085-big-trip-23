import { OFFERS } from '../mock/offers';

export default class OffersModel {
  #offers = OFFERS;

  // во имя инкапсуляции!
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
}
