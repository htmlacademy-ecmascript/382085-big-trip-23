
export default class NewWaypointButtonView {
  #handleButtonClick = null;
  #buttonElement = null;

  constructor({buttonElement, onNewButtonClick}) {
    this.#handleButtonClick = onNewButtonClick;
    this.#buttonElement = buttonElement;

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
