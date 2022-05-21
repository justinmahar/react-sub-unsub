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
   * Sets a timer which executes a function once the timer expires using `setTimeout`.
   * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
   *
   * @param handler A function to be executed after the timer expires.
   * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
   * @param args Additional arguments which are passed through to the handler specified.
   * @returns The Unsubscribe function for this subscription.
   */
  public static subscribeTimeout<TArgs extends any[]>(
    handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler,
    delay?: number,
    ...args: TArgs
  ): Unsubscribe {
    const timeout = setTimeout(handler, delay, args);
    return () => clearTimeout(timeout);
  }

  /**
   * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
   * Returns an unsubscribe function that clears the interval using `clearInterval`.
   *
   * @param handler A function to be executed after the timer expires.
   * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
   * @param args Additional arguments which are passed through to the handler once the timer expires.
   * @returns The Unsubscribe function for this subscription.
   */
  public static subscribeInterval<TArgs extends any[]>(
    handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler,
    delay?: number,
    ...args: TArgs
  ): Unsubscribe {
    const interval = setInterval(handler, delay, args);
    return () => clearInterval(interval);
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
  /**
   * Construct a new Subscriptions object.
   *
   * A Subscriptions object can be used to subscribe and unsubscribe to events,
   * and to collect subscriptions in an array to be unsubscribed all at once.
   *
   * Calling any of the subscribe functions will add the unsubscribe function to
   * an internal array. You can then call `unsubscribeAll()` to unsubscribe all
   * at once and clear the list.
   *
   * You can optionally pass in an array of unsubscribe functions to start with.
   *
   * @param unsubs Optional array of unsubscribe functions. Defaults to an empty list.
   */
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
   * Sets a timer which executes a function once the timer expires using `setTimeout`.
   * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
   *
   * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
   *
   * @param handler A function to be executed after the timer expires.
   * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
   * @param args Additional arguments which are passed through to the handler specified.
   * @returns The Unsubscribe function for this subscription.
   */
  public subscribeTimeout<TArgs extends any[]>(
    handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler,
    delay?: number,
    ...args: TArgs
  ): Unsubscribe {
    const timeout = setTimeout(handler, delay, args);
    const unsub = () => clearTimeout(timeout);
    this.unsubs.push(unsub);
    return unsub;
  }

  /**
   * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
   * Returns an unsubscribe function that clears the interval using `clearInterval`.
   *
   * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
   *
   * @param handler A function to be executed after the timer expires.
   * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
   * @param args Additional arguments which are passed through to the handler once the timer expires.
   * @returns The Unsubscribe function for this subscription.
   */
  public subscribeInterval<TArgs extends any[]>(
    handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler,
    delay?: number,
    ...args: TArgs
  ): Unsubscribe {
    const interval = setInterval(handler, delay, args);
    const unsub = () => clearInterval(interval);
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
