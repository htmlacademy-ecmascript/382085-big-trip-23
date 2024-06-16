import { DESTINATIONS } from '../mock/destinations';

export default class DestinationsModel {
  #destinations = DESTINATIONS;

  // во имя инкапсуляции!
  get destinations() {
    return this.#destinations;
  }

  getDestination(id) {
    const result = this.#destinations.find((item) => item.id === id);
    return result;
  }
}
