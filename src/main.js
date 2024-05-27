import { RenderPosition, render } from './render.js';
import TripEventsPresenter from './trip-events-presenter';
import { TripInfoView } from './view/trip-info';
import WaypointsModel from './model/waypoints-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const eventsPresenter = new TripEventsPresenter({
  eventsContainer,
  waypointsModel,
  destinationsModel,
  offersModel
});

eventsPresenter.init();
