
export default class NewWaypointButtonView {
  #handleButtonClicked = null;
  #buttonElement = null;

  constructor({onNewButtonClicked, buttonElement}) {
    this.#handleButtonClicked = onNewButtonClicked;
    this.#buttonElement = buttonElement;

    this.#buttonElement.addEventListener('click', this.#onNewButtonClicked);
  }

  enableButton() {
    this.#buttonElement.disabled = false;
  }

  disableButton() {
    this.#buttonElement.disabled = true;
  }

  #onNewButtonClicked = () => {
    this.#handleButtonClicked();
  };
}
