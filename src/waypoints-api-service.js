import ApiService from './framework/api-service';

export default class WaypointsApiService extends ApiService {
  get waypoints () {
    return this._load({url: 'waypoints'})
      .then(ApiService.parseResponse);
  }

  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `waypoints/${waypoint.id}`,
      method: 'PUT',
      body: JSON.stringify(waypoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
