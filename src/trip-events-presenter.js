import { render, RenderPosition, replace } from './framework/render';
import WaypointView from './view/waypoint';
import FilterView from './view/filter';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';
import OffersSectionView from './view/offers-section';
import DestinationView from './view/destination';
import EventTypeSelectorView from './view/event-type-selector';
import TripEventsListView from './view/trip-events-list';
import ListEmptyView from './view/list-empty';
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

  #renderEditWaypoint({editWaypointView, waypointTypeSelector, offerSectionView, destinationView}) {
    const editWaypointHeaderElement = editWaypointView.element.querySelector('.event__header');
    const editWaypointDetailsElement = editWaypointView.element.querySelector('.event__details');

    render(editWaypointView, this.#tripEventsListView.element);

    render(offerSectionView, editWaypointDetailsElement);
    render(destinationView, editWaypointDetailsElement);
    render(waypointTypeSelector, editWaypointHeaderElement, RenderPosition.AFTERBEGIN);
  }

  #renderWaypoint(waypoint) {

    let waypointView = null;
    let waypointEdit = null;

    const onEscapeKeyPress = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replace(waypointView, waypointEdit.editWaypointView);
        document.removeEventListener('keydown', onEscapeKeyPress);
      }
    };

    const onOpenClick = () => {
      this.#renderEditWaypoint(waypointEdit);
      replace(waypointEdit.editWaypointView, waypointView);
      document.addEventListener('keydown', onEscapeKeyPress);
    };

    const onFormSubmit = () => {
      replace(waypointView, waypointEdit.editWaypointView);
      document.removeEventListener('keydown', onEscapeKeyPress);
    };

    const destination = this.#destinationsModel.getDestination(waypoint.destination);
    const offers = this.#offersModel.getOffersForEventType(waypoint.type);
    waypointView = new WaypointView({waypoint, destination, offers, onOpenClick});

    waypointEdit = this.#createWaypointComponent(waypoint, onFormSubmit);

    render(waypointView, this.#tripEventsListView.element);
  }

  #createWaypointComponent(waypoint, onFormSubmit) {

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
      onFormSubmit
    };
    const editWaypointView = new EditWaypointView(editWaypointData);
    const waypointTypeSelector = new EventTypeSelectorView(waypoint); // нужно id и type у waypoint
    const offerSectionView = new OffersSectionView({waypoint, offers: offersForType}); // нужно id и offers у waypoint
    const destinationView = new DestinationView(selectedDestination);

    return {editWaypointView, waypointTypeSelector, offerSectionView, destinationView};
  }


  init() {
    const waypoints = this.#waypointsModel.waypoints;

    this.#createWaypointComponent(DUMMY_WAYPOINT);

    const filterContainer = document.querySelector('.trip-controls__filters');
    render(new FilterView(), filterContainer);

    const mockFilterValue = 'everything';

    if (waypoints.length === 0) {
      const comp = new ListEmptyView(mockFilterValue);
      render(comp, this.#container);
    } else {
      render(new SortView(), this.#container, RenderPosition.AFTERBEGIN);
      render(this.#tripEventsListView, this.#container);
      //const mockEditWaypointId = 'check-in-hotel-pyatigorsk';
      for (const waypoint of waypoints) {
        //if (waypoint.id === mockEditWaypointId) {
        //  this.#createWaypointComponent(waypoint);
        //} else {
        //  this.#renderWaypoint(waypoint);
        //}
        this.#renderWaypoint(waypoint);
      }
    }
  }
}
