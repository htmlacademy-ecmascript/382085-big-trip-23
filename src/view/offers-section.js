import { createElement } from '../render';

/**
  * @param {import('../mock/trip').Waypoint} waypoint
  * @param {import('../mock/offers').Offer} offer
  * @returns {string} разметка
*/
function createOfferMarkup(waypoint, offer) {
  const isSelected = waypoint.offers.find((offerId) => offerId === offer.id);
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${waypoint.id}" type="checkbox" name="event-offer-${offer.id}" ${isSelected ? 'checked' : ''}/>
      <label class="event__offer-label" for="event-offer-${offer.id}-${waypoint.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
}

/**
  * @param {import('../mock/trip').Waypoint} waypoint
  * @param {import('../mock/offers').Offer[]} availableOffers
  * @returns {string} разметка
*/
function createOffersMarkup(waypoint, availableOffers) {

  if (availableOffers.length === 0) {
    return '';
  }

  const offersMarkup = availableOffers.map((offer) => createOfferMarkup(waypoint, offer)).join(' ');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

        ${offersMarkup}

      </div>
    </section>`;
}

export default class OffersSectionView {

  constructor({waypoint, offers}) {
    this.waypoint = waypoint;
    this.offers = offers;
  }

  getTemplate() {
    return createOffersMarkup(this.waypoint, this.offers);
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
