import dayjs from 'dayjs';
const DATE_FORMAT = 'D MMMM';

export function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}
