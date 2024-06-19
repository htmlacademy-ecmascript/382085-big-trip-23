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
    } catch (err) {
      //console.error(err);
      this.#waypoints = [];
      this._notify(UpdateType.INIT_FAILED, []);
      return;
    }
    this._notify(UpdateType.INIT, this.#waypoints);
  }
}
