import { UpdateType } from '../constants';
import Observable from '../framework/observable';

export default class WaypointsModel extends Observable {
  /** @type {import('../constants').Waypoint[]} */
  #waypoints = [];

  #apiService = null;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  /**
   * @param {UpdateType} updateType
   * @param {import('../constants').Waypoint} update
   */
  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({id}) => id === update.id);
    if (index === -1) {
      throw new Error('[waypoints model::update] Task is not found');
    }

    try {
      const response = await this.#apiService.updateWaypoint(this.#adaptToServer(update));
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints.splice(index, 1, updatedWaypoint);
      this._notify(updateType, updatedWaypoint);
    } catch (err) {
      throw new Error('Can not update task!');
    }
  }

  /**
   * @param {UpdateType} updateType
   * @param {import('../constants').Waypoint} update
   */
  async addWaypoint(updateType, update) {
    try {
      const response = await this.#apiService.addWaypoint(this.#adaptToServer(update));
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints.push(newWaypoint);
      this._notify(updateType, newWaypoint);
    } catch (err) {
      throw new Error('Can not add task!');
    }
  }

  /**
   * @param {UpdateType} updateType
   * @param {import('../constants').Waypoint} update
   */
  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({id}) => id === update.id);
    if (index === -1) {
      throw new Error('[waypoints model::delete] Task is not found');
    }
    try {
      await this.#apiService.deleteWaypoint(this.#adaptToServer(update));
      this.#waypoints.splice(index, 1);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can not delete task!');
    }
  }

  get waypoints() {
    return this.#waypoints;
  }

  #adaptToServer = (clientWaypoint) => {
    const serverWaypoint = {...clientWaypoint};

    serverWaypoint.date_from = serverWaypoint.dateFrom; // eslint-disable-line
    serverWaypoint.date_to = serverWaypoint.dateTo; // eslint-disable-line
    serverWaypoint.is_favorite = serverWaypoint.isFavorite; // eslint-disable-line
    serverWaypoint.base_price = serverWaypoint.basePrice; // eslint-disable-line

    delete serverWaypoint.dateFrom;
    delete serverWaypoint.dateTo;
    delete serverWaypoint.isFavorite;
    delete serverWaypoint.basePrice;
    return serverWaypoint;
  };

  #adaptToClient = (serverWaypoint) => {
    const clientWaypoint = {...serverWaypoint};
    clientWaypoint.dateFrom = clientWaypoint.date_from;
    clientWaypoint.dateTo = clientWaypoint.date_to;
    clientWaypoint.isFavorite = clientWaypoint.is_favorite;
    clientWaypoint.basePrice = clientWaypoint.base_price;

    delete clientWaypoint.date_from;
    delete clientWaypoint.date_to;
    delete clientWaypoint.is_favorite;
    delete clientWaypoint.base_price;
    return clientWaypoint;
  };

  async init() {
    try {
      const waypoints = await this.#apiService.waypoints;
      this.#waypoints = waypoints.map(this.#adaptToClient);
      // DEBUG
//      const data = [ { "id": "point-1", "base_price": 1000, "date_from": "2023-07-15T13:30:00.000Z", "date_to": "2023-07-15T14:00:00.000Z", "destination": "empty-destination", "is_favorite": false, "offers": [ "drive-1" ], "type": "drive"
//  }, { "id": "point-2", "base_price": 2000, "date_from": "2023-07-16T16:00:00.000Z", "date_to": "2023-07-16T23:00:00.000Z", "destination": "no-pictures-destination", "is_favorite": true, "offers": [ "taxi-1", "taxi-3" ], "type": "taxi" }, { "id": "point-3", "base_price": 3000, "date_from": "2020-02-17T12:30:00.000Z",
//    "date_to": "2030-02-18T13:30:00.000Z", "destination": "empty-destination", "is_favorite": false, "offers": [], "type": "sightseeing" }, { "id": "point-4", "base_price": 4000, "date_from": "2020-11-17T13:25:00.000Z", "date_to": "2020-11-19T13:55:00.000Z", "destination": "full-destination", "is_favorite": false, "offers": [], "type": "check-in" }, { "id": "point-5", "base_price": 5000, "date_from": "2030-04-19T11:29:00.000Z", "date_to": "2030-04-21T00:29:00.000Z", "destination": "no-pictures-destination", "is_favorite": false, "offers": [ "train-1" ], "type": "train" } ];
//      this.#waypoints = data.map(this.#adaptToClient);
    } catch (err) {
      this.#waypoints = [];
      this._notify(UpdateType.INIT_FAILED, []);
      console.log('waypoints model init failed');
      return;
    }
    this._notify(UpdateType.INIT, this.#waypoints);
  }
}
