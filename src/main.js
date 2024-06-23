import { BIG_TRIP_URI, DEFAULT_FILTER_ID, UpdateType } from './constants';
import { forkJoinObservables } from './utils/common';

import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';

import NewWaypointButtonView from './view/new-waypoint-button';

import TripEventsPresenter from './presenter/trip-events-presenter';
import FilterPresenter from './presenter/filter-presenter';

import WaypointsApiService from './api-services/waypoints-api-service';
import DestinationsApiService from './api-services/destinations-api-service';
import OffersApiService from './api-services/offers-api-service';
import TripInfoPresenter from './presenter/trip-info-presenter';

const AUTHORIZATION = 'Basic 2point718281828459045';

const newWaypointButton = document.querySelector('.trip-main__event-add-btn');
newWaypointButton.setAttribute('disabled', '');

const waypointService = new WaypointsApiService(BIG_TRIP_URI, AUTHORIZATION);
const waypointsModel = new WaypointsModel({ apiService: waypointService });

const destinationsService = new DestinationsApiService(BIG_TRIP_URI, AUTHORIZATION);
const destinationsModel = new DestinationsModel({ apiService: destinationsService });

const offersService = new OffersApiService(BIG_TRIP_URI, AUTHORIZATION);
const offersModel = new OffersModel({ apiService: offersService });

// inits are async
waypointsModel.init();
destinationsModel.init();
offersModel.init();

function main() {

  // trip info ======================================================================
  const tripInfoContainer = document.querySelector('.trip-main');
  new TripInfoPresenter({tripInfoContainer, waypointsModel, destinationsModel, offersModel});
  //================================================================================

  // filter ================================================================================
  const filterModel = new FilterModel();
  const filterContainer = document.querySelector('.trip-controls__filters');
  const filterPresenter = new FilterPresenter({filterContainer, filterModel, waypointsModel});

  forkJoinObservables([waypointsModel, destinationsModel, offersModel], (status) => filterPresenter.init(status));
  //================================================================================

  // trip events ================================================================================
  const eventsContainer = document.querySelector('.trip-events');
  const tripEventsPresenter = new TripEventsPresenter({
    eventsContainer,
    waypointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    onNewWaypointClose
  });
  tripEventsPresenter.init();
  //================================================================================

  // new waypoint button ======================================================
  const newWaypointButtonComponent = new NewWaypointButtonView({newWaypointButton, onNewButtonClick});

  function onNewButtonClick() {
    filterModel.setFilter(UpdateType.MINOR, DEFAULT_FILTER_ID);
    newWaypointButtonComponent.disableButton();
    tripEventsPresenter.createNewWaypoint();
  }

  function onNewWaypointClose() {
    newWaypointButtonComponent.enableButton();
  }

  forkJoinObservables([waypointsModel, destinationsModel, offersModel], (status) => {
    switch (status) {
      case UpdateType.INIT_FAILED:
        newWaypointButtonComponent.disableButton();
        break;
      default:
        newWaypointButtonComponent.enableButton();
    }
  });
  // ================================================================================
}

main();
