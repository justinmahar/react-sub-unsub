import EventEmitter from 'events';

/** Call this function to unsubscribe the listener. */
export type Unsubscribe = () => void;

/**
 * Static functions for subscribing and unsubscribing to and from events.
 */
export class Subscribe {
  /**
   * Call a function that adds a listener and returns a function that will unsubscribe the listener.
   *
   * The function passed in will be called immediately to add the listener,
   * and its Unsubscribe function will be returned.
   *
   * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
   * @returns The Unsubscribe function for this subscription.
   */
  public static subscribe(subscribe: () => Unsubscribe): Unsubscribe {
    try {
      return subscribe();
    } catch (e) {
      console.error(e);
    }
    return () => {
      // No-op when catching an error
    };
  }

  /**
   * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
   *
   * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
   * @param eventName The name of the event to listen for.
   * @param listener The listener callback that is called when the event occurs.
   * @returns The Unsubscribe function for this subscription.
   */
  public static subscribeEvent(
    eventEmitter: EventEmitter,
    eventName: string,
    listener: (...args: any[]) => void,
  ): Unsubscribe {
    eventEmitter.addListener(eventName, listener);
    return () => {
      eventEmitter.removeListener(eventName, listener);
    };
  }

  /**
   * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
   *
   * @param domObj The DOM object to subscribe to for events.
   * @param eventName The name of the event to listen for.
   * @param listener The listener callback that is called when the event occurs.
   * @returns The Unsubscribe function for this subscription.
   */
  public static subscribeDOMEvent(
    domObj: Window | Node,
    eventName: string,
    listener: (...args: any[]) => void,
  ): Unsubscribe {
    domObj.addEventListener(eventName, listener);
    return () => {
      domObj.removeEventListener(eventName, listener);
    };
  }

  /**
   * Call all unsubscribe functions passed in. Can pass either an array of unsubscribe functions,
   * or a single unsubscribe function.
   *
   * @param unsubs An array of unsubscribe functions, or a single unsubscribe function.
   */
  public static unsubscribeAll(unsubs: Unsubscribe | Unsubscribe[]): void {
    if (Array.isArray(unsubs)) {
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      try {
        unsubs();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

/**
 * A Subscriptions object can be used to subscribe and unsubscribe to events,
 * and to collect subscriptions in an array to be unsubscribed all at once.
 *
 * Calling any of the subscribe functions will add the unsubscribe function to
 * an internal array. You can then call `unsubscribeAll()` to unsubscribe all
 * at once and clear the list.
 */
export class Subscriptions {
  constructor(
    /** A list of unsubscribe functions for all subscribe calls that have been made. */
    public unsubs: Unsubscribe[] = [],
  ) {}

  /**
   * Call a function that adds a listener and returns a function that will unsubscribe the listener.
   *
   * The function passed in will be called immediately to add the listener,
   * and its Unsubscribe function will be returned.
   *
   * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
   *
   * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
   * @returns The Unsubscribe function for this subscription.
   */
  public subscribe(subscribe: () => Unsubscribe): Unsubscribe {
    const unsub = Subscribe.subscribe(subscribe);
    this.unsubs.push(unsub);
    return unsub;
  }

  /**
   * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
   *
   * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
   *
   * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
   * @param eventName The name of the event to listen for.
   * @param listener The listener callback that is called when the event occurs.
   * @returns The Unsubscribe function for this subscription.
   */
  public subscribeEvent(
    eventEmitter: EventEmitter,
    eventName: string,
    listener: (...args: any[]) => void,
  ): Unsubscribe {
    const unsub = Subscribe.subscribeEvent(eventEmitter, eventName, listener);
    this.unsubs.push(unsub);
    return unsub;
  }

  /**
   * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
   *
   * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
   *
   * @param domObj The DOM object to subscribe to for events.
   * @param eventName The name of the event to listen for.
   * @param listener The listener callback that is called when the event occurs.
   * @returns The Unsubscribe function for this subscription.
   */
  public subscribeDOMEvent(domObj: Window | Node, eventName: string, listener: (...args: any[]) => void): Unsubscribe {
    const unsub = Subscribe.subscribeDOMEvent(domObj, eventName, listener);
    this.unsubs.push(unsub);
    return unsub;
  }

  /**
   * Call all unsubscribe functions and clear the unsubscribe list.
   */
  public unsubscribeAll(): void {
    Subscribe.unsubscribeAll(this.unsubs);
    this.unsubs = [];
  }
}
