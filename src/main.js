import { RenderPosition, render } from './framework/render.js';
import TripEventsPresenter from './presenter/trip-events-presenter';
import TripInfoView from './view/trip-info';
import WaypointsModel from './model/waypoints-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterView from './view/filter.js';

const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();


if (waypointsModel.waypoints.length !== 0) {
  const tripInfoData = {
    waypoints: waypointsModel.waypoints,
    destinations: destinationsModel.destinations,
    offers: offersModel.offers
  };
  render(new TripInfoView(tripInfoData), tripMainContainer, RenderPosition.AFTERBEGIN);
}

const mockSelectedFilter = 'everything';

const filterContainer = document.querySelector('.trip-controls__filters');
const filterView = new FilterView({waypoints: waypointsModel.waypoints, selectedFilter: mockSelectedFilter});
render(filterView, filterContainer);

const eventsPresenter = new TripEventsPresenter({
  eventsContainer,
  waypointsModel,
  destinationsModel,
  offersModel,
  selectedFilter: mockSelectedFilter
});

eventsPresenter.init();
