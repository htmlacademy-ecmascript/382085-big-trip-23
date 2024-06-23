import TripInfoView from '../view/trip-info';
import { UpdateType } from '../constants';
import { RenderPosition, remove, render, replace } from '../framework/render';
import { forkJoinObservables } from '../utils/common';

export default class TripInfoPresenter {
  #tripInfoView = null;
  #container = document.querySelector('.trip-main');
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({tripInfoContainer, waypointsModel, destinationsModel, offersModel}) {
    this.#container = tripInfoContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    forkJoinObservables([waypointsModel, destinationsModel, offersModel], (status) => this.init(status));
  }

  #createTripInfoView() {
    const tripInfoData = {
      waypoints: this.#waypointsModel.waypoints,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers
    };
    this.#tripInfoView = new TripInfoView(tripInfoData);
  }

  init(updateType) {
    if (updateType === UpdateType.INIT_FAILED) {
      return;
    }
    const prevTripInfoView = this.#tripInfoView;
    if (this.#waypointsModel.waypoints.length === 0) {
      if (prevTripInfoView) {
        remove(prevTripInfoView);
      }
      this.#tripInfoView = null;
      return;
    }

    this.#createTripInfoView();
    if (prevTripInfoView) {
      replace(this.#tripInfoView, prevTripInfoView);
      remove(prevTripInfoView);
      return;
    }
    render(this.#tripInfoView, this.#container, RenderPosition.AFTERBEGIN);
  }
}
