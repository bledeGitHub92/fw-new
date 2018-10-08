/**
 * Queue
 * @param {Array} arr
 * @property {Boolean} debug
 * @example
 *  import Queue from 'feewee/utils/Queue';
 *  Queue.debug = true;
 *  const queue = new Queue([1, 2, 3])
 *  queue.out(1);
 *  queue.out(4);
 */
export default class Queue {
  constructor(arr) {
    this.queue = [...arr];
    this.debug = debug;
  }

  in(item) {
    if (Queue.debug) {
      console.log('====================================');
      console.log('queue in: ', item);
      console.log('====================================');
    }

    this.queue.push(item);

    return this
  }

  out(item) {
    let deleted = null;

    if (item) {
      let index = this.queue.indexOf(item)

      if (index) {
        deleted = this.queue.splice(index, 1)[0]
      }
    } else {
      deleted = this.queue.shift()
    }

    if (Queue.debug) {
      console.log('====================================');
      console.log('queue out: ', deleted);
      console.log('====================================');
    }

    return this
  }

  clear() {
    this.queue = []
    return this
  }
}