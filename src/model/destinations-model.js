export default class DestinationsModel {
  /** @type {import("../constants").Destination[]} */
  #destinations = [];

  #apiService = null;

  constructor({apiService}) {
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestination(id) {
    const result = this.#destinations.find((item) => item.id === id);
    return result;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
