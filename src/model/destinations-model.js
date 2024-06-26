import { UpdateType } from '../constants';
import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  /** @type {import("../constants").Destination[]} */
  #destinations = [];

  #apiService = null;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestination(destinationId) {
    const result = this.#destinations.find(({id}) => id === destinationId);
    return result;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch (err) {
      this.#destinations = [];
      this._notify(UpdateType.INIT_FAILED, this.#destinations);
      return;
    }
    this._notify(UpdateType.INIT, this.#destinations);
  }
}
