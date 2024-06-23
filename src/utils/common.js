import { UpdateType } from '../constants';

const TIME_DURATION_INTERVALS = [
  {dayjsName: 'day', abbreviation: 'D'},
  {dayjsName: 'hour', abbreviation: 'H'},
  {dayjsName: 'minute', abbreviation:'M'}
];

/**
 * @param {import('dayjs').Dayjs} dateFrom
 * @param {import('dayjs').Dayjs} dateTo
 * @returns {string} строка с длительностью для точки маршрута в режиме просмотра
 */
export function getDurationString(dateFrom, dateTo) {
  let localDateTo = dateTo;
  return Array.from(TIME_DURATION_INTERVALS, ({dayjsName, abbreviation}) => {
    const quantity = localDateTo.diff(dateFrom, dayjsName);
    localDateTo = localDateTo.subtract(quantity, dayjsName);
    const formattedQuantity = String(quantity).padStart(2, '0');
    return `${formattedQuantity}${abbreviation}`;
  })
    .join(' ');
}

/**
 * @param {string} text
 * @returns {string} та же строка, но первая буква в верхнем регистре
 */
export function capitalize(text) {
  return `${text[0].toUpperCase()}${text.slice(1)}`;
}

/**
 * @param {import('../framework/observable').default[]} observables
 * @param {Function} cb коллбэк, который будет вызван, когда все observable вызовут notify
 */
export function forkJoinObservables(observables, cb) {
  const state = Array.from(observables, () => 0);
  observables.forEach((observable, idx) => {
    observable.addObserver(makeWaitAllAndCall(idx, state, cb));
  });
}

/**
 * @param {number} idx индекс в массиве state
 * @param {any[]} state массив с результатами
 * @param {Function} cb коллбэк, который будет вызван, когда все observable вызовут notify
 */
function makeWaitAllAndCall(idx, state, cb) {
  return function (updateType) {
    state[idx] = updateType;

    if (state.every((value) => value !== 0)) {
      try {
        if (state.some((value) => value === UpdateType.INIT_FAILED)) {
          cb(UpdateType.INIT_FAILED);
          return;
        }
        cb(UpdateType.INIT);
      } catch (err) {
        throw new Error('In observer callback', err);
      }
    }
  };
}
