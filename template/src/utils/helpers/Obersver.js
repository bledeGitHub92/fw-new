
/**
 * @Class Observer
 * @author VuChan
 * @constructor
 * @return {Object} Observer Design Pattern Implementation
 */
export default function Observer() {
  this.events = {};
}

/**
 * observer.on('eventName', function listener() {})
 * @param  {String} eventName
 * @param  {Function} listener
 * @return {handlers<Array>}
 */
Observer.prototype.on = function (eventName, listener) {
  if (!this.events[ eventName ]) {
    this.events[ eventName ] = [ listener ];
  } else {
    this.events[ eventName ].push(listener);
  }

  return this.events[ eventName ];
};

/**
 * observer.off('eventName', function listener() {})
 * @param  {String} eventName
 * @param  {Function} listener
 * @return {Boolean|Null}
 */
Observer.prototype.off = function (eventName, listener) {
  if (eventName) {
    let handlers = this.events[ eventName ];

    if (handlers && handlers.length) {
      if (listener) {
        return handlers = handlers.filter(handler => handler === listener);
      } else {
        delete this.events[ eventName ];
        return true;
      }
    }
  } else {
    this.events = {};
  }
};

/**
 * observer.trigger('eventName', data1, data2, ...dataN)
 * @param  {String} eventName
 * @param  {Array}  data
 * @return {Boolean}
 */
Observer.prototype.trigger = function (eventName, ...data) {
  const handlers = this.events[ eventName ];

  if (handlers) {
    handlers.forEach(handler => handler.apply(null, data));
    return true;
  }
};