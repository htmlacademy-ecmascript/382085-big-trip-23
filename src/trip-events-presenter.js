import { render, RenderPosition } from './framework/render';
import WaypointView from './view/waypoint';
import FilterView from './view/filter';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';
import OffersSectionView from './view/offers-section';
import DestinationView from './view/destination';
import EventTypeSelectorView from './view/event-type-selector';
import TripEventsListView from './view/trip-events-list';
import { DUMMY_WAYPOINT } from './constants';

export default class TripEventsPresenter {
  #tripEventsListView = new TripEventsListView();
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #container = null;

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel }) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
  }

  createEditWaypointElement(waypoint) {

    const offersForType = this.#offersModel.getOffersForEventType(waypoint.type);
    const selectedDestination = this.#destinationsModel.getDestination(waypoint.destination);
    // <header class="event__header">
    // waypointTypeSelector

    // <section class="event__details">
    // offers
    // description
    const editWaypointData = {
      waypoint,
      destinations: this.#destinationsModel.destinations,
    };
    const editWaypointView = new EditWaypointView(editWaypointData);
    const waypointTypeSelector = new EventTypeSelectorView(waypoint); // нужно id и type у waypoint
    const offerSectionView = new OffersSectionView({waypoint, offers: offersForType}); // нужно id и offers у waypoint
    const destinationView = new DestinationView(selectedDestination);

    const editWaypointHeaderElement = editWaypointView.element.querySelector('.event__header');
    const editWaypointDetailsElement = editWaypointView.element.querySelector('.event__details');

    render(editWaypointView, this.#tripEventsListView.element);

    render(offerSectionView, editWaypointDetailsElement);
    render(destinationView, editWaypointDetailsElement);
    render(waypointTypeSelector, editWaypointHeaderElement, RenderPosition.AFTERBEGIN);
  }


  init() {
    const waypoints = this.#waypointsModel.waypoints;

    render(new SortView(), this.#container, RenderPosition.AFTERBEGIN);

    render(this.#tripEventsListView, this.#container);

    this.createEditWaypointElement(DUMMY_WAYPOINT, this.#tripEventsListView.element);

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);

    const mockEditWaypointId = 'check-in-hotel-pyatigorsk';
    for (const waypoint of waypoints) {
      if (waypoint.id === mockEditWaypointId) {
        this.createEditWaypointElement(waypoint, this.#tripEventsListView.element);
      } else {
        const destination = this.#destinationsModel.getDestination(waypoint.destination);
        const offers = this.#offersModel.getOffersForEventType(waypoint.type);
        render(new WaypointView({waypoint, destination, offers}), this.#tripEventsListView.element);
      }
    }
  }
}
