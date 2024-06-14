import dayjs from 'dayjs';
import { createElement } from '../render';


/**
  * @param {import('../mock/trip').Waypoint[]} waypoints
  * @param {import('../mock/destinations').Destination[]} destinations
  * @param {import('../mock/offers').Offer[]} offers
  * @returns {string} разметка
  */
function createTripInfoMarkup(waypoints, destinations, offers) {

  // Первый и последний пункты маршрута ===========================================
  let textElements = [];
  if (waypoints.length <= 3) {
    textElements = waypoints.map(({destination}) => destinations.find(({id}) => id === destination).name);
  } else {
    textElements = [
      destinations.find(({id}) => id === waypoints[0].destination).name,
      '...',
      destinations.find(({id}) => id === waypoints[waypoints.length - 1].destination).name
    ];
  }
  const tripBrief = textElements.join(' &mdash; ');

  // Полная стоймость путешествия ===========================================
  const totalPrice = waypoints.reduce((acc, waypoint) => {
    const offersForWaypointType = offers.find(({type}) => type === waypoint.type).offers;
    acc += waypoint.basePrice;
    const totalOffersPrice = waypoint.offers.reduce((offersPriceAcc, offer) => {
      offersPriceAcc += offersForWaypointType.find(({id}) => id === offer).price;
      return offersPriceAcc;
    }, 0);
    acc += totalOffersPrice;
    return acc;
  }, 0);


  // Временной отрезок путешествия ===========================================
  let earliest = dayjs(waypoints[0].dateFrom);
  let latest = dayjs(waypoints[waypoints.length - 1].dateTo);
  waypoints.forEach(({dateFrom, dateTo}) => {
    earliest = earliest > dateFrom ? dateFrom : earliest;
    latest = latest < dateTo ? dateTo : latest;
  });

  let timePeriod = '18&nbsp;&mdash;&nbsp;20 Mar';
  if (earliest.year() !== latest.year()) {
    timePeriod = `${earliest.format('DD MMM YYYY')}&nbsp;&mdash;&nbsp;${latest.format('DD MMM YYYY')}`;
  } else if (earliest.month() !== latest.month()) {
    timePeriod = `${earliest.format('DD MMM')}&nbsp;&mdash;&nbsp;${latest.format('DD MMM')}`;
  } else if (earliest.date() !== latest.date()) {
    timePeriod = `${earliest.date()}&nbsp;&mdash;&nbsp;${latest.date()} ${latest.format('MMM')}`;
  } else {
    timePeriod = `${earliest.format('HH:mm')}&nbsp;&mdash;&nbsp;${latest.format('HH:mm')} ${latest.format('DD MMM')}`;
  }

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripBrief}</h1>

        <p class="trip-info__dates">${timePeriod}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
}

export default class TripInfoView {
  constructor({waypoints, destinations, offers}) {
    this.waypoints = waypoints;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createTripInfoMarkup(this.waypoints, this.destinations, this.offers);
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
