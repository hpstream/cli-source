export function hasOwnProperty<T>(obj:T, prop:keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
// d= hasOwnProperty;