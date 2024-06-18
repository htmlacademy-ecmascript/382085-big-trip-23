import { DEFAULT_FILTER_ID, UpdateType } from './constants.js';

import WaypointsModel from './model/waypoints-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';

import { RenderPosition, remove, render, replace } from './framework/render.js';
import TripInfoView from './view/trip-info';
import NewWaypointButtonView from './view/new-waypoint-button.js';

import TripEventsPresenter from './presenter/trip-events-presenter';
import FilterPresenter from './presenter/filter-presenter.js';


const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

// trip info presenter ================================================================
let tripInfoView = null;
const tripMainContainer = document.querySelector('.trip-main');

function createTripInfoView() {
  const tripInfoData = {
    waypoints: waypointsModel.waypoints,
    destinations: destinationsModel.destinations,
    offers: offersModel.offers
  };
  tripInfoView = new TripInfoView(tripInfoData);
}

const initTripInfoView = () => {
  const prevTripInfoView = tripInfoView;
  if (waypointsModel.waypoints.length === 0) {
    if (prevTripInfoView) {
      remove(prevTripInfoView);
    }
    tripInfoView = null;
    return;
  }
  createTripInfoView();
  if (prevTripInfoView) {
    replace(tripInfoView, prevTripInfoView);
    remove(prevTripInfoView);
    return;
  }

  render(tripInfoView, tripMainContainer, RenderPosition.AFTERBEGIN);
};


//================================================================================
waypointsModel.addObserver(initTripInfoView);

initTripInfoView();


const eventsContainer = document.querySelector('.trip-events');

const tripEventsPresenter = new TripEventsPresenter({
  eventsContainer,
  waypointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewWaypointClose: onNewWaypointClose
});

// new task button presenter ======================================================
const newButtonElement = document.querySelector('.trip-main__event-add-btn');
const newWaypointButton = new NewWaypointButtonView({buttonElement: newButtonElement, onNewButtonClicked});

function onNewButtonClicked() {
  filterModel.setFilter(UpdateType.MINOR, DEFAULT_FILTER_ID);
  newWaypointButton.disableButton();
  tripEventsPresenter.createNewWaypoint();
}

function onNewWaypointClose() {
  newWaypointButton.enableButton();
}
// ================================================================================

const filterContainer = document.querySelector('.trip-controls__filters');
const filterPresenterData = {
  container: filterContainer,
  filterModel,
  waypointsModel,
};
const filterPresenter = new FilterPresenter(filterPresenterData);
filterPresenter.init();


tripEventsPresenter.init();
