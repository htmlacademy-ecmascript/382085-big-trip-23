import { createElement } from '../render';

/**
*/
function createOptionMarkup(offer, selectedOffers) {
  const isSelected = selectedOffers.find((offerId) => offerId === offer.id);
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${isSelected ? 'checked' : ''}/>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `;
}

/**
*/
function getOffersMarkup(availableOffers, selectedOffers) {

  if (availableOffers.length === 0) {
    return '';
  }

  const offersItems = [];
  availableOffers.forEach((offer) => {
    offersItems.push(createOptionMarkup(offer, selectedOffers));
  });

  const offersMarkup = offersItems.join(' ');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

        ${offersMarkup}

      </div>
    </section>`;
}

export default class OffersSectionView {

  constructor(offers, selectedOffers) {
    this.offers = offers;
    this.selectedOffers = selectedOffers;
  }

  getTemplate() {
    return getOffersMarkup(this.offers, this.selectedOffers);
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
