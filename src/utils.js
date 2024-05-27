import dayjs from 'dayjs';

export function getRandomArrayElement(anArray) {
  return anArray[Math.floor(Math.random() * anArray.length)];
}

const DATE_FORMAT = 'D MMMM';

export function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}
