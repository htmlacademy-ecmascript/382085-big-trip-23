import { BIG_TRIP_URI, DEFAULT_FILTER_ID, UpdateType } from './constants';

import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';

import { RenderPosition, remove, render, replace } from './framework/render';
import TripInfoView from './view/trip-info';
import NewWaypointButtonView from './view/new-waypoint-button';

import TripEventsPresenter from './presenter/trip-events-presenter';
import FilterPresenter from './presenter/filter-presenter';

import WaypointsApiService from './api-services/waypoints-api-service';
import DestinationsApiService from './api-services/destinations-api-service';
import OffersApiService from './api-services/offers-api-service';

const AUTHORIZATION = 'Basic 2point718281828459045';

const waypointService = new WaypointsApiService(BIG_TRIP_URI, AUTHORIZATION);
const waypointsModel = new WaypointsModel({apiService: waypointService});

const destinationsService = new DestinationsApiService(BIG_TRIP_URI, AUTHORIZATION);
const destinationsModel = new DestinationsModel({apiService: destinationsService});

const offersService = new OffersApiService(BIG_TRIP_URI, AUTHORIZATION);
const offersModel = new OffersModel({apiService: offersService});

function main() {
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
}

Promise.allSettled([destinationsModel.init(), offersModel.init(), waypointsModel.init()])
  .then(() => {
    main();
  })
  .catch((error) => {
    console.error(error);
  });
