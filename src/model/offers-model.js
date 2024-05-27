import { OFFERS } from '../mock/offers';

export default class OffersModel {
  offers = OFFERS;

  getOffers() {
    return this.offers;
  }
}
