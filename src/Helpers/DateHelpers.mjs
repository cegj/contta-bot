export default class DateHelpers {
  static getFirstDay(year, month){
    let first = new Date(year, +month-1, 1)
    first = first.toISOString().split('T')[0]
    return first;
  }
  static getLastDay(year, month){
    let last = new Date(year, month, 0)
    last = last.toISOString().split('T')[0]
    return last;
  }
}