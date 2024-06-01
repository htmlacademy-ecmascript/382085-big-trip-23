import { TRIP_WAYPOINTS } from '../mock/trip';

export default class WaypointsModel {
  #waypoints = TRIP_WAYPOINTS;

  // во имя инкапсуляции!
  get waypoints() {
    return this.#waypoints;
  }
}
