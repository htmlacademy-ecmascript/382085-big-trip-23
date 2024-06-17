/**
  * @param {Object} waypoint
  * @param {import('../mock/offers').Offer} offer
  * @returns {string} разметка
*/
function createOfferMarkup(waypoint, offer) {
  const isSelected = waypoint.offers.has(offer.id);
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer="${offer.id}" id="event-offer-${offer.id}-${waypoint.id}" type="checkbox" name="event-offer-${offer.id}" ${isSelected ? 'checked' : ''}/>
      <label class="event__offer-label" for="event-offer-${offer.id}-${waypoint.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
}

/**
  * @param {Object} waypoint
  * @param {import('../mock/offers').Offer[]} availableOffers
  * @returns {string} разметка
*/
export function createOffersMarkup(waypoint, availableOffers) {

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
