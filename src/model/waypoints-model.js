import Observable from '../framework/observable';
import { TRIP_WAYPOINTS } from '../mock/trip';

export default class WaypointsModel extends Observable {
  #newWaypointCounter = 0;
  #waypoints = TRIP_WAYPOINTS;

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);
    if (index === -1) {
      throw new Error('[waypoints model::update] Task is not found');
    }
    this.#waypoints.splice(index, 1, update);
    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    update.id = `fake_id-${this.#newWaypointCounter}`;
    this.#newWaypointCounter += 1;
    this.#waypoints.push(update);
    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);
    if (index === -1) {
      throw new Error('[waypoints model::delete] Task is not found');
    }
    this.#waypoints.splice(index, 1);
    this._notify(updateType);
  }

  // во имя инкапсуляции!
  get waypoints() {
    return this.#waypoints;
  }
}
