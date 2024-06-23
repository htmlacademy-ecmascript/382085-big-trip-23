
export default class NewWaypointButtonView {
  #handleButtonClick = null;
  #buttonElement = null;

  constructor({newWaypointButton, onNewButtonClick}) {
    this.#handleButtonClick = onNewButtonClick;
    this.#buttonElement = newWaypointButton;

    this.#buttonElement.addEventListener('click', this.#onNewButtonClick);
  }

  enableButton() {
    this.#buttonElement.disabled = false;
  }

  disableButton() {
    this.#buttonElement.disabled = true;
  }

  #onNewButtonClick = () => {
    this.#handleButtonClick();
  };
}
