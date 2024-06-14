import { remove, render, RenderPosition, replace } from '../framework/render';
import WaypointView from '../view/waypoint';
import EditWaypointView from '../view/edit-waypoint';
import OffersSectionView from '../view/offers-section';
import DestinationView from '../view/destination';
import EventTypeSelectorView from '../view/event-type-selector';

const Mode = {
  VIEW: 'view',
  EDIT: 'edit',
};

export default class WaypointPresenter {
  #waypointViewComponent = null;
  #waypointEditObject = null;

  #waypointsListContainer = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #waypoint = null;
  #mode = Mode.VIEW;

  constructor({waypointsListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#waypointsListContainer = waypointsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

  #setEditMode() {
    this.#renderEditWaypoint(this.#waypointEditObject);
    replace(this.#waypointEditObject.editWaypointView, this.#waypointViewComponent);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
    this.#handleModeChange(); // важно чтобы это было до смены режима!

    this.#mode = Mode.EDIT;
  }

  #setViewMode() {
    replace(this.#waypointViewComponent, this.#waypointEditObject.editWaypointView);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
    this.#mode = Mode.VIEW;
  }

  #handleFormCancel = () => {
    this.#setViewMode();
  };

  #handleEscapeKeyPress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#setViewMode();
    }
  };

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(waypoint);
    // TODO тут потом будет POST запрос
    this.#setViewMode();
  };

  #handleOpenEdit = () => {
    this.#setEditMode();
  };

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevViewComponent = this.#waypointViewComponent;
    const prevEditObject = this.#waypointEditObject;

    this.#waypointViewComponent = this.#createWaypointViewComponent();

    this.#waypointEditObject = this.#createWaypointEditComponent();

    if (prevViewComponent === null || prevEditObject === null) {
      this.#renderViewWaypoint();
      return;
    }

    //if (this.#waypointsListContainer.element.contains(prevViewComponent.element)) {
    if (this.#mode === Mode.VIEW) {
      replace(this.#waypointViewComponent, prevViewComponent);
    }

    //if (this.#waypointsListContainer.element.contains(prevEditObject.element)) {
    if (this.#mode === Mode.EDIT) {
      this.#renderEditWaypoint(this.#waypointEditObject);
      replace(this.#waypointEditObject.editWaypointView, prevEditObject.editWaypointView);
    }

    remove(prevViewComponent);
    remove(prevEditObject.editWaypointView);
  }

  resetView() {
    if (this.#mode !== Mode.VIEW) {
      this.#setViewMode();
    }
  }

  destroy() {
    remove(this.#waypointViewComponent);
    remove(this.#waypointEditObject.editWaypointView);
  }
}
