import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import { EVENT_TYPE_ICONS } from '../constants';
import { getDurationString } from '../utils';

/**
* @param {import('../mock/offers').Offer} offer
* @returns {string} вёрстка одной дополнительной опции
*/
function createOfferMarkup(offer) {
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
* @param {import('../mock/offers').Offer[]} offers опции для текущего типа точки путешествия
* @returns {string} вёрстка для одного пункта в путешествии
*/
function createWaypointTemplate(waypoint, destination, offers) {

  const totalPrice = waypoint.basePrice;
  const offersMarkup = [];

  // тут надо отобразить только подключённые в данной точке путешествия офферы
  for (const offer of waypoint.offers) {
    const offerObject = offers.find((item) => item.id === offer);
    offersMarkup.push(createOfferMarkup(offerObject));
    //totalPrice += offerObject.price; // не понял, надо ли включать в цену и предложения тоже
  }

  const eventDate = dayjs(waypoint.dateFrom).format('MMM DD');
  const eventDateAttrib = waypoint.dateFrom;
  const eventIcon = EVENT_TYPE_ICONS[waypoint.type];

  const dayjsFrom = dayjs(waypoint.dateFrom);
  const dayjsTo = dayjs(waypoint.dateTo);

  const humanizedInterval = getDurationString(dayjsFrom, dayjsTo);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${eventDateAttrib}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${eventIcon}" alt="Event type icon">
        </div>
        <h3 class="event__title">${waypoint.type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${waypoint.dateFrom}">${dayjsFrom.format('HH:MM')}</time>
            &mdash;
            <time class="event__end-time" datetime="${waypoint.dateTo}">${dayjsTo.format('HH:MM')}</time>
          </p>
          <p class="event__duration">${humanizedInterval}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup.join(' ')}
        </ul>
        <button class="event__favorite-btn ${waypoint.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
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

export default class WaypointView extends AbstractView {

  constructor({waypoint, destination, offers}) {
    super();
    this.waypoint = waypoint;
    this.destination = destination;
    this.offers = offers;
  }

  get template() {
    return createWaypointTemplate(this.waypoint, this.destination, this.offers);
  }
}
