import { DUMMY_WAYPOINT, UpdateType, UserAction } from '../constants';
import { RenderPosition, remove, render } from '../framework/render';
import EditWaypointView from '../view/edit-waypoint/edit-waypoint-view';

export default class NewWaypointPresenter {
  /** @type {import('../constants').Destination[]} */
  #destinations = null;
  /** @type {import('../constants').OffersList} */
  #offers = null;

  /** @type {EditWaypointView} */
  #waypointEditComponent = null;

  #onNewWaypointClose = null;
  #handleFormSubmit = null;

  #container = null;

  constructor({container, destinations, offers, onFormSubmit, onNewWaypointClose}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#onNewWaypointClose = onNewWaypointClose;
  }

  init() {
    const editWaypointData = {
      waypoint: {...DUMMY_WAYPOINT},
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#onFormSubmit,
      onFormCancel: this.#handleFormCancel,
      onWaypointDelete: this.#handleFormCancel,
    };
    this.#waypointEditComponent = new EditWaypointView(editWaypointData);

    render(this.#waypointEditComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onDocumentKeydown);
  }

  setSaving() {
    this.#waypointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  }

  #onFormSubmit = (newWaypoint) => {
    this.#handleFormSubmit(UserAction.ADD_WAYPOINT, UpdateType.MINOR, newWaypoint);
  };

  #handleFormCancel = () => {
    this.#onNewWaypointClose();
    this.destroy();
  };

  #onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#onNewWaypointClose();
      this.destroy();
    }
  };

  destroy() {
    remove(this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#onDocumentKeydown);
  }
}
