const toString = Object.prototype.toString;
export function typeOf(obj) {
  return toString.call(obj).slice(8, -1).toLowerCase();
}
