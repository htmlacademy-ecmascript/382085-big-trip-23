import { DESTINATIONS } from '../mock/destinations';

export default class DestinationsModel {
  destinations = DESTINATIONS;

  getDestinations() {
    return this.destinations;
  }

  getDestination(id) {
    const result = this.destinations.find((item) => item.id === id);
    return result;
  }
}
