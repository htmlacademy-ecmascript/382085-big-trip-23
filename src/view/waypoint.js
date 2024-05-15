/**
* @typedef {Object} Offer
* @prop {string} title
* @prop {number} price
*/

/**
* @typedef {Object} WaypointData
* @prop {string} title
* @prop {Date} from
* @prop {Date} to
* @prop {number} price
* @prop {Offer[]} offers
*/

/**
* @param {Offer} offer
*/
function getOffer(offer) {
  return `
<li class="event__offer">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</li>`;
}


/**
* @param {WaypointData} waypointData
*/
export function waypoint(waypointData) {

  const offersMarkup = [];
  for (const offer of waypointData.offers) {
    offersMarkup.push(getOffer(offer));
  }

  const eventDuration = '40 M';
  const eventDate = waypointData.from.toLocaleString('en-us', {month: 'short', date: '2-digit'});
  const eventDateAttrib = waypointData.from.toISOString().slice(0, 10);

  return `
<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${eventDateAttrib}">${eventDate}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/check-in.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${waypointData.title}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T12:25">16:20</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T13:35">17:00</time>
      </p>
      <p class="event__duration">${eventDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${waypointData.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersMarkup.join(' ')}
    </ul>
    <button class="event__favorite-btn event__favorite-btn--active" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}
