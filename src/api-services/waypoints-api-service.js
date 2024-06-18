import ApiService from '../framework/api-service';

export default class WaypointsApiService extends ApiService {
  get waypoints () {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateWaypoint(serverWaypoint) {
    const response = await this._load({
      url: `points/${serverWaypoint.id}`,
      method: 'PUT',
      body: JSON.stringify(serverWaypoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addWaypoint(serverWaypoint) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(serverWaypoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteWaypoint(serverWaypoint) {
    return await this._load({
      url: `points/${serverWaypoint.id}`,
      method: 'DELETE',
    });
  }
}
