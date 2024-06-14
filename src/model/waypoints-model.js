import { TRIP_WAYPOINTS } from '../mock/trip';

export default class WaypointsModel {
  waypoints = TRIP_WAYPOINTS;

  getWaypoints() {
    return this.waypoints;
  }
}
