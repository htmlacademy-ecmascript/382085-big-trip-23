import { render, RenderPosition, replace } from './framework/render';
import WaypointView from './view/waypoint';
import SortView from './view/sort';
import EditWaypointView from './view/edit-waypoint';
import OffersSectionView from './view/offers-section';
import DestinationView from './view/destination';
import EventTypeSelectorView from './view/event-type-selector';
import TripEventsListView from './view/trip-events-list';
import ListEmptyView from './view/list-empty';
//import { DUMMY_WAYPOINT } from './constants';

export default class TripEventsPresenter {
  #container = null;

  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortComponent = new SortView();
  #tripEventsListComponent = new TripEventsListView();

  constructor({eventsContainer, waypointsModel, destinationsModel, offersModel }) {
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#container = eventsContainer;
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

    const onFormCancel = () => {
      replace(waypointView, waypointEdit.editWaypointView);
      document.removeEventListener('keydown', onEscapeKeyPress);
    };

    const onOpenClick = () => {
      this.#renderEditWaypoint(waypointEdit);
      replace(waypointEdit.editWaypointView, waypointView);
      document.addEventListener('keydown', onEscapeKeyPress);
    };

    const onFormSubmit = () => {
      // TODO тут потом будет POST запрос
      replace(waypointView, waypointEdit.editWaypointView);
      document.removeEventListener('keydown', onEscapeKeyPress);
    };

    waypointView = this.#createWaypointViewComponent(waypoint, onOpenClick);

    waypointEdit = this.#createWaypointEditComponent(waypoint, onFormSubmit, onFormCancel);

    this.#renderViewWaypoint(waypointView);
  }

  #createWaypointViewComponent(waypoint, onOpenClick) {
    const destination = this.#destinationsModel.getDestination(waypoint.destination);
    const offers = this.#offersModel.getOffersForEventType(waypoint.type);
    return new WaypointView({waypoint, destination, offers, onOpenClick});
  }

  #createWaypointEditComponent(waypoint, onFormSubmit, onFormCancel) {

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
      onFormSubmit,
      onFormCancel
    };
    const editWaypointView = new EditWaypointView(editWaypointData);
    const waypointTypeSelector = new EventTypeSelectorView(waypoint); // нужно id и type у waypoint
    const offerSectionView = new OffersSectionView({waypoint, offers: offersForType}); // нужно id и offers у waypoint
    const destinationView = new DestinationView(selectedDestination);

    return {editWaypointView, waypointTypeSelector, offerSectionView, destinationView};
  }

  #renderViewWaypoint(waypointView) {
    render(waypointView, this.#tripEventsListComponent.element);
  }

  #renderEditWaypoint({editWaypointView, waypointTypeSelector, offerSectionView, destinationView}) {
    const editWaypointHeaderElement = editWaypointView.element.querySelector('.event__header');
    const editWaypointDetailsElement = editWaypointView.element.querySelector('.event__details');

    render(editWaypointView, this.#tripEventsListComponent.element);

    render(offerSectionView, editWaypointDetailsElement);
    render(destinationView, editWaypointDetailsElement);

    render(waypointTypeSelector, editWaypointHeaderElement, RenderPosition.AFTERBEGIN);
  }

  #renderWaypointsList(waypoints, selectedFilter) {
    //const createWaypointComponent = this.#createWaypointEditComponent(DUMMY_WAYPOINT);

    if (waypoints.length === 0) {
      this.#renderEmptyListView(selectedFilter);
      return;
    }

    this.#renderSortComponent();
    render(this.#tripEventsListComponent, this.#container);
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

  #renderEmptyListView(selectedFilter) {
    const comp = new ListEmptyView(selectedFilter);
    render(comp, this.#container);
  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  init(selectedFilter) {
    const waypoints = this.#waypointsModel.waypoints;

    this.#renderWaypointsList(waypoints, selectedFilter);
  }
}
