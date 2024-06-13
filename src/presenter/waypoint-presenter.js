import { remove, render, RenderPosition, replace } from '../framework/render';
import WaypointView from '../view/waypoint';
import EditWaypointView from '../view/edit-waypoint';
import OffersSectionView from '../view/offers-section';
import DestinationView from '../view/destination';
import EventTypeSelectorView from '../view/event-type-selector';

export default class WaypointPresenter {
  #waypointViewComponent = null;
  #waypointEditObject = null;

  #waypointsListContainer = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;

  #waypoint = null;

  constructor({waypointsListContainer, destinationsModel, offersModel, onDataChange}) {
    this.#waypointsListContainer = waypointsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
  }

  #createWaypointViewComponent() {
    const destination = this.#destinationsModel.getDestination(this.#waypoint.destination);
    const offersForType = this.#offersModel.getOffersForEventType(this.#waypoint.type);
    const waypointViewData = {
      waypoint: this.#waypoint,
      destination,
      offers: offersForType,
      onOpenClick: this.#handleOpenEdit,
      onFavoriteClick: this.#handleDataChange,
    };
    return new WaypointView(waypointViewData);
  }

  #createWaypointEditComponent() {

    const editWaypointData = {
      waypoint: this.#waypoint,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleFormCancel,
    };
    const editWaypointView = new EditWaypointView(editWaypointData);

    const waypointTypeSelector = new EventTypeSelectorView(this.#waypoint); // нужно id и type у waypoint

    // при изменении типа точки маршрута нужнро будет подгружать предложения (offers)
    const offersForType = this.#offersModel.getOffersForEventType(this.#waypoint.type);
    const offerSectionView = new OffersSectionView({waypoint: this.#waypoint, offers: offersForType}); // нужно id и offers у waypoint

    // при изменении пункта назначения нужно будет подгружать его описание и фото
    const selectedDestination = this.#destinationsModel.getDestination(this.#waypoint.destination);
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
    replace(this.#waypointViewComponent, this.#waypointEditObject.editWaypointView);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
  };

  #handleEscapeKeyPress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      replace(this.#waypointViewComponent, this.#waypointEditObject.editWaypointView);
      document.removeEventListener('keydown', this.#handleEscapeKeyPress);
    }
  };

  #handleFormSubmit = () => {
    // TODO тут потом будет POST запрос
    replace(this.#waypointViewComponent, this.#waypointEditObject.editWaypointView);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
  };

  #handleOpenEdit = () => {
    this.#renderEditWaypoint(this.#waypointEditObject);
    replace(this.#waypointEditObject.editWaypointView, this.#waypointViewComponent);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
  };

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevViewComponent = this.#waypointViewComponent;
    const prevEditComponent = this.#waypointEditObject;

    this.#waypointViewComponent = this.#createWaypointViewComponent();

    this.#waypointEditObject = this.#createWaypointEditComponent();

    if (prevViewComponent === null || prevEditComponent === null) {
      this.#renderViewWaypoint();
      return;
    }

    if (this.#waypointsListContainer.element.contains(prevViewComponent.element)) {
      replace(this.#waypointViewComponent, prevViewComponent);
    }

    if (this.#waypointsListContainer.element.contains(prevEditComponent.element)) {
      replace(this.#waypointEditObject.editWaypointView, prevEditComponent);
    }

    remove(prevViewComponent);
    remove(prevEditComponent.editWaypointView);
  }

  destroy() {
    remove(this.#waypointViewComponent);
    remove(this.#waypointEditObject.editWaypointView);
  }
}
