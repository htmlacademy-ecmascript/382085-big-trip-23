import { DESTINATIONS } from '../mock/destinations';

export default class DestinationsModel {
  destinations = DESTINATIONS;

  getDestinations() {
    return this.destinations;
  }
}
