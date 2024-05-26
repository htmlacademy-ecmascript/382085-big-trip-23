import { RenderPosition, render } from './render.js';
import TripEventsPresenter from './trip-events-presenter';
import { TripInfoView } from './view/trip-info';

const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const eventsPresenter = new TripEventsPresenter({eventsContainer});

eventsPresenter.init();
