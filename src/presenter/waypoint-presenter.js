import { remove, render, replace } from '../framework/render';
import WaypointView from '../view/waypoint';
import EditWaypointView from '../view/edit-waypoint/edit-waypoint';
import { UpdateType, UserAction } from '../constants';

const Mode = {
  VIEW: 'view',
  EDIT: 'edit',
};

export default class WaypointPresenter {
  /** @type {WaypointView} */
  #waypointViewComponent = null;
  /** @type {EditWaypointView} */
  #waypointEditComponent = null;

  #waypointsListContainer = null;

  /** @type {import('../model/destinations-model').default} */
  #destinationsModel = null;
  /** @type {import('../model/offers-model').default} */
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  /** @type {import('../constants').Waypoint} */
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
      onFavoriteClick: this.#handleFavoritesClick
    };
    return new WaypointView(waypointViewData);
  }

  #createWaypointEditComponent() {
    const waypointEditData = {
      waypoint: this.#waypoint,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleFormCancel,
      onWaypointDelete: this.#handleWaypointDelete,
    };
    return new EditWaypointView(waypointEditData);
  }

  #renderViewWaypoint() {
    render(this.#waypointViewComponent, this.#waypointsListContainer.element);
  }

  #renderEditWaypoint() {
    render(this.#waypointEditComponent, this.#waypointsListContainer.element);
  }

  #setEditMode() {
    this.#renderEditWaypoint();
    replace(this.#waypointEditComponent, this.#waypointViewComponent);
    this.#waypointEditComponent.reset(this.#waypoint);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
    this.#handleModeChange(); // важно чтобы это было до смены режима!

    this.#mode = Mode.EDIT;
  }

  #setViewMode() {
    replace(this.#waypointViewComponent, this.#waypointEditComponent);
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

  #handleFavoritesClick = () => {
    //console.log('[WaypointPresenter::handleFavoritesClick]', this.#waypoint.isFavorite);
    this.#handleDataChange(UserAction.UPDATE_WAYPOINT, UpdateType.MINOR, {...this.#waypoint, isFavorite: !this.#waypoint.isFavorite});
  };

  #handleWaypointDelete = (waypoint) => {
    // см. комментарий в EditWaypointView
    this.#handleDataChange(UserAction.DELETE_WAYPOINT, UpdateType.MINOR, {...waypoint});
  };

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(UserAction.UPDATE_WAYPOINT, UpdateType.MINOR, waypoint);
  };

  #handleOpenEdit = () => {
    this.#setEditMode();
  };

  setSaving() {
    if (this.#mode === Mode.EDIT) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.VIEW) {
      this.#waypointViewComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  }

  setDeleting() {
    if (this.#mode === Mode.EDIT) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevViewComponent = this.#waypointViewComponent;
    const prevEditComponent = this.#waypointEditComponent;

    this.#waypointViewComponent = this.#createWaypointViewComponent();
    this.#waypointEditComponent = this.#createWaypointEditComponent();

    if (prevViewComponent === null || prevEditComponent === null) {
      this.#renderViewWaypoint();
      return;
    }

    if (this.#mode === Mode.VIEW) {
      replace(this.#waypointViewComponent, prevViewComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#waypointEditComponent, prevEditComponent);
    }

    remove(prevViewComponent);
    remove(prevEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.VIEW) {
      this.#setViewMode();
    }
  }

  destroy() {
    if (this.#mode === Mode.EDIT) {
      document.removeEventListener('keydown', this.#handleEscapeKeyPress);
    }
    remove(this.#waypointViewComponent);
    remove(this.#waypointEditComponent);
  }
}
