import { render, RenderPosition } from './render';
import WaypointView from './view/waypoint';
import FilterView from './view/filter';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';
import AddWaypointView from './view/add-waypoint';
import OffersSectionView from './view/offers-section';
import DestinationView from './view/destination';
import EventTypeSelectorView from './view/event-type-selector';
import TripEventsListView from './view/trip-events-list';

export default class TripEventsPresenter {
  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel }) {
    this.waypointsModel = waypointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.container = eventsContainer;
  }

  init() {

    const mockSelectedWaypointType = 'flight';
    const mockSelectedDestination = 'kislovodsk-park';
    const mockSelectedOffers = ['add-luggage', 'comfort-class'];

    const waypoints = this.waypointsModel.getWaypoints();

    render(new SortView(), this.container, RenderPosition.AFTERBEGIN);

    const offersForType = this.offersModel.getOffersForEventType(mockSelectedWaypointType);
    const selectedDestination = this.destinationsModel.getDestination(mockSelectedDestination);

    const tripEventsListView = new TripEventsListView();

    const addWaypointView = new AddWaypointView();
    const offerSectionView = new OffersSectionView(offersForType, mockSelectedOffers);
    const destinationView = new DestinationView(selectedDestination);
    const eventTypeSelector = new EventTypeSelectorView(mockSelectedWaypointType);


    // <header class="event__header">
    // eventTypeSelector

    // <section class="event__details">
    // offers
    // description

    const waypointsListElement = tripEventsListView.getElement();

    const eventHeaderElement = addWaypointView.getElement().querySelector('.event__header');
    const eventDetailsElement = addWaypointView.getElement().querySelector('.event__details');

    //render(new EditWaypointView(), this.container);
    render(tripEventsListView, this.container);
    render(addWaypointView, waypointsListElement);
    render(offerSectionView, eventDetailsElement);
    render(destinationView, eventDetailsElement);
    render(eventTypeSelector, eventHeaderElement, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < waypoints.length; i += 1) {
      const destination = this.destinationsModel.getDestination(waypoints[i].destination);
      const offers = this.offersModel.getOffersForEventType(waypoints[i].type);
      render(new WaypointView({waypoint: waypoints[i], destination, offers}), waypointsListElement);
    }

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);
  }
}
