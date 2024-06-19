import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

/**
  * Краткое содержание путешествия
  * @param {import('../constants').Waypoint[]} waypoints
  * @param {import('../constants').Destination[]} destinations
  * @returns {string} строка с началом и концом путешествия
  */
function getTripBrief(waypoints, destinations) {
  let textElements = [];
  if (waypoints.length <= 3) {
    textElements = waypoints.map(({destination}) => destinations.find(({id}) => id === destination).name);
  } else {

    const lastWaypoint = waypoints.at(-1);
    const firstWaypoint = waypoints.at(0);
    textElements = [
      destinations.find(({id}) => id === firstWaypoint.destination).name,
      '...',
      destinations.find(({id}) => id === lastWaypoint.destination).name
    ];
  }
  return textElements.join(' &mdash; ');
}

/**
  * Полная стоймость путешествия
  * @param {import('../constants').Waypoint[]} waypoints
  * @param {import('../constants').Offer[]} offers
  * @returns {number} число - полная стоймость поездки
  */
function getTripTotalPrice(waypoints, offers) {
  return waypoints.reduce((acc, waypoint) => {
    const offersForWaypointType = offers.find(({type}) => type === waypoint.type).offers;
    const totalOffersPrice = waypoint.offers.reduce((offersPriceAcc, offer) => {
      offersPriceAcc += offersForWaypointType.find(({id}) => id === offer).price;
      return offersPriceAcc;
    }, 0);
    acc += Number(waypoint.basePrice) + Number(totalOffersPrice);
    return acc;
  }, 0);
}

/**
  * Временной отрезок путешествия
  * @param {import('../constants').Waypoint[]} waypoints
  * @returns {string} строка с временным интервалом поездки
  */
function getTripTimeSpan(waypoints) {
  let earliest = waypoints[0].dateFrom;
  let latest = waypoints[waypoints.length - 1].dateTo;
  waypoints.forEach(({dateFrom, dateTo}) => {
    earliest = earliest > dateFrom ? dateFrom : earliest;
    latest = latest < dateTo ? dateTo : latest;
  });

  earliest = dayjs(earliest);
  latest = dayjs(latest);
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

  return timePeriod;
}

/**
  * @param {import('../constants').Waypoint[]} waypoints
  * @param {import('../constants').Destination[]} destinations
  * @param {import('../constants').Offer[]} offers
  * @returns {string} разметка
  */
function createTripInfoMarkup(waypoints, destinations, offers) {
  const tripBrief = getTripBrief(waypoints, destinations);
  const totalPrice = getTripTotalPrice(waypoints, offers);
  const timePeriod = getTripTimeSpan(waypoints);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripBrief}</h1>

        <p class="trip-info__dates">${timePeriod}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  /** @type {import('../constants').Waypoint[]} */
  #waypoints = [];
  /** @type {import('../constants').Destination[]} */
  #destinations = [];
  /** @type {import('../constants').OffersList} */
  #offers = [];

  constructor({waypoints, destinations, offers}) {
    super();
    this.#waypoints = waypoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoMarkup(this.#waypoints, this.#destinations, this.#offers);
  }
}
