import { createElement } from '../render';
import { EVENT_TYPE_ICONS } from '../../constants';
import dayjs from 'dayjs';
import { getDurationString } from '../utils';

/**
* @param {import('../mock/offers').Offer} offer
* @returns {string} вёрстка одной дополнительной опции
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
* @param {import('../mock/trip').Waypoint} waypoint
* @param {import('../mock/destinations').Destination} destination объект Destination соответствующий назначению пункта путешествия
* @param {import('../mock/offers').Offer} offers опции для текущего типа пункта путешествия
* @returns {string} вёрстка для одного пункта в путешествии
*/
function createWaypointTemplate(waypoint, destination, offers) {

  const offersMarkup = [];
  // TODO уточнить тут все доступные, или все подключённые?
  for (const offer of waypoint.offers) {
    const offerObject = offers.find((item) => item.id === offer);
    offersMarkup.push(getOffer(offerObject));
  }

  const eventDate = dayjs(waypoint.date_from).format('MMM DD'); //new Date(waypoint.date_from).toLocaleString('en-us', {month: 'short', date: '2-digit'});
  const eventDateAttrib = waypoint.date_from; //new Date(waypoint.date_from).toISOString().slice(0, 10);
  const eventIcon = EVENT_TYPE_ICONS[waypoint.type];

  const dayjsFrom = dayjs(waypoint.date_from);
  const dayjsTo = dayjs(waypoint.date_to);

  const humanizedInterval = getDurationString(dayjsFrom, dayjsTo);

  // TODO в цене писать полную стойиость с опциями? или только base_price?
  return `
<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${eventDateAttrib}">${eventDate}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="${eventIcon}" alt="Event type icon">
    </div>
    <h3 class="event__title">${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${waypoint.date_from}">${dayjsFrom.format('HH:MM')}</time>
        &mdash;
        <time class="event__end-time" datetime="${waypoint.date_to}">${dayjsTo.format('HH:MM')}</time>
      </p>
      <p class="event__duration">${humanizedInterval}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${waypoint.base_price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersMarkup.join(' ')}
    </ul>
    <button class="event__favorite-btn ${waypoint.is_favorite ? 'event__favorite-btn--active' : ''}" type="button">
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

export default class WaypointView {

  constructor({waypoint, destination, offers}) {
    this.waypoint = waypoint;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createWaypointTemplate(this.waypoint, this.destination, this.offers);
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
