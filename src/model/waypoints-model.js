import { UpdateType } from '../constants';
import Observable from '../framework/observable';

export default class WaypointsModel extends Observable {
  #newWaypointCounter = 0;
  #waypoints = [];

  #apiService = null;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({id}) => id === update.id);
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
    const index = this.#waypoints.findIndex(({id}) => id === update.id);
    if (index === -1) {
      throw new Error('[waypoints model::delete] Task is not found');
    }
    this.#waypoints.splice(index, 1);
    this._notify(updateType);
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
      this.#waypoints = [];
    }
    this._notify(UpdateType.MAJOR, this.#waypoints);
  }
}
