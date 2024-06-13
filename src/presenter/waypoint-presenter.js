import { render, RenderPosition, replace } from '../framework/render';
import WaypointView from '../view/waypoint';
import EditWaypointView from '../view/edit-waypoint';
import OffersSectionView from '../view/offers-section';
import DestinationView from '../view/destination';
import EventTypeSelectorView from '../view/event-type-selector';

export default class TaskPresenter {
  #waypointViewComponent = null;
  #waypointEditComponent = null;

  #waypointsListContainer = null;

  #destinationsModel = null;
  #offersModel = null;

  #waypoint = null;

  constructor({waypointListContainer, destinationsModel, offersModel}) {
    this.#waypointsListContainer = waypointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #createWaypointViewComponent() {
    const destination = this.#destinationsModel.getDestination(this.#waypoint.destination);
    const offersForType = this.#offersModel.getOffersForEventType(this.#waypoint.type);
    const waypointViewData = {
      waypoint: this.#waypoint,
      destination,
      offers: offersForType,
      onOpenClick: this.#handleOpenEdit,
    };
    return new WaypointView(waypointViewData);
  }

  #createWaypointEditComponent() {

    // при изменении типа точки маршрута нужнро будет подгружать предложения (offers)
    const offersForType = this.#offersModel.getOffersForEventType(this.#waypoint.type);
    // при изменении пункта назначения нужно будет подгружать его описание и фото
    const selectedDestination = this.#destinationsModel.getDestination(this.#waypoint.destination);
    // <header class="event__header">
    // waypointTypeSelector

    // <section class="event__details">
    // offers
    // description
    const editWaypointData = {
      waypoint: this.#waypoint,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleFormCancel,
    };
    const editWaypointView = new EditWaypointView(editWaypointData);
    // при изменении типа точки маршрута нужнро будет подгружать предложения (offers)
    const waypointTypeSelector = new EventTypeSelectorView(this.#waypoint); // нужно id и type у waypoint
    // при изменении пункта назначения нужно будет подгружать его описание и фото
    const offerSectionView = new OffersSectionView({waypoint: this.#waypoint, offers: offersForType}); // нужно id и offers у waypoint
    const destinationView = new DestinationView(selectedDestination);

    return {editWaypointView, waypointTypeSelector, offerSectionView, destinationView};
  }

  #renderViewWaypoint() {
    render(this.#waypointViewComponent, this.#waypointsListContainer.element);
  }

  #renderEditWaypoint({editWaypointView, waypointTypeSelector, offerSectionView, destinationView}) {
    const editWaypointHeaderElement = editWaypointView.element.querySelector('.event__header');
    const editWaypointDetailsElement = editWaypointView.element.querySelector('.event__details');

    render(editWaypointView, this.#waypointsListContainer.element);

    render(offerSectionView, editWaypointDetailsElement);
    render(destinationView, editWaypointDetailsElement);

    render(waypointTypeSelector, editWaypointHeaderElement, RenderPosition.AFTERBEGIN);
  }

  #handleFormCancel = () => {
    replace(this.#waypointViewComponent, this.#waypointEditComponent.editWaypointView);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
  };

  #handleEscapeKeyPress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      replace(this.#waypointViewComponent, this.#waypointEditComponent.editWaypointView);
      document.removeEventListener('keydown', this.#handleEscapeKeyPress);
    }
  };

  #handleFormSubmit = () => {
    // TODO тут потом будет POST запрос
    replace(this.#waypointViewComponent, this.#waypointEditComponent.editWaypointView);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
  };

  #handleOpenEdit = () => {
    this.#renderEditWaypoint(this.#waypointEditComponent);
    replace(this.#waypointEditComponent.editWaypointView, this.#waypointViewComponent);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
  };

  init(waypoint) {
    this.#waypoint = waypoint;

    this.#waypointViewComponent = this.#createWaypointViewComponent();

    this.#waypointEditComponent = this.#createWaypointEditComponent();
  }
}
