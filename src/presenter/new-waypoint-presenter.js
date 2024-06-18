import { DUMMY_WAYPOINT, UpdateType, UserAction } from '../constants';
import { RenderPosition, remove, render } from '../framework/render';
import EditWaypointView from '../view/edit-waypoint/edit-waypoint';

export default class NewWaypointPresenter {
  #destinations = null;
  #offers = null;

  #onNewWaypointClose = null;
  #handleFormSubmit = null;

  #container = null;
  #waypointEditComponent = null;
  constructor({container, destinations, offers, onFormSubmit, onNewWaypointClose}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#onNewWaypointClose = onNewWaypointClose;
  }

  init() {
    const editWaypointData = {
      waypoint: {...DUMMY_WAYPOINT}, //this.#newWaypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#onFormSubmit,
      onFormCancel: this.#handleFormCancel,
      onWaypointDelete: this.#handleFormCancel,
    };
    this.#waypointEditComponent = new EditWaypointView(editWaypointData);

    render(this.#waypointEditComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
  }

  #onFormSubmit = (newWaypoint) => {
    this.#handleFormSubmit(UserAction.ADD_WAYPOINT, UpdateType.MINOR, newWaypoint);
    this.destroy();
  };

  #handleFormCancel = () => {
    this.destroy();
  };

  #handleEscapeKeyPress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  destroy() {
    this.#onNewWaypointClose();
    remove(this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);
  }
}
