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

  getDestination(id) {
    const result = this.#destinations.find((item) => item.id === id);
    return result;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
      // debug
//      this.#destinations = [ { "id": "no-pictures-destination", "description": "No pictures destination description", "name": "No pictures destination", "pictures": [] },
//  { "id": "full-destination", "description": "Full destination description", "name": "Full destination", "pictures": [ { "src": "https://21.objects.pages.academy/static/destinations/4.jpg", "description": "First picture" }, { "src": "https://21.objects.pages.academy/static/destinations/15.jpg", "description": "Second picture" }, { "src": "https://21.objects.pages.academy/static/destinations/4.jpg", "description": "Third picture" } ] },
//  { "id": "empty-destination", "name": "Empty destination", "description": "", "pictures": [] } ];
    } catch (err) {
      this.#destinations = [];
      this._notify(UpdateType.INIT_FAILED, this.#destinations);
      console.log('destinations model init failed');
      return;
    }
    this._notify(UpdateType.INIT, this.#destinations);
  }
}
