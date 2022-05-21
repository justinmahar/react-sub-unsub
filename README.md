<h2 align="center">
  🔔 subscribe-events
</h2>
<h3 align="center">
  Subscribe and unsubscribe to JS events and timers with ease.
</h3>
<p align="center">
  <a href="https://badge.fury.io/js/subscribe-events" target="_blank" rel="noopener noreferrer">
    <img src="https://badge.fury.io/js/subscribe-events.svg" alt="npm Version" />
  </a>
  <a href="https://github.com/justinmahar/subscribe-events/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" />
  </a>
  <a href="https://github.com/justinmahar/subscribe-events/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/justinmahar/subscribe-events/workflows/Deploy/badge.svg" alt="Deploy Status" />
  </a>
</p>

## Documentation

Read the **[official documentation](https://justinmahar.github.io/subscribe-events/)**.

## Overview

When adding event listeners, often you will need to remove that listener later. If you fail to do so, bugs or memory leaks can occur. The same applies for intervals and timeouts.

To simplify this pattern, use the `Subscriptions` class in this library. When subscribing to an event or timer through this class, an unsubscribe function is stored and returned. Calling this function will remove the listener.

There is built-in support for subscribing to [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) events and DOM object events, and support for events from custom listener interfaces. There is also support for timeouts and intervals.

This library also includes an easy way to unsubscribe all listeners at once with a single call, and is a perfect complement to React effects.

### Features include:

- **🔔 Quickly and easily subscribe and unsubscribe to events**
  - An easy way to subscribe and unsubscribe from events in JavaScript.
- **💁‍♀️ Covers common use cases, as well as custom ones**
  - Built-in support for [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) and DOM events, and custom.
- **⏰ Timeout and interval support**
  - Includes support for [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) and [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) to make life easier.
- **⚛️ Perfect for React effects**
  - Makes adding/removing listeners and timers in React effects a breeze.
- **👍 Simple, flexible, and convenient**
  - Use static functions yourself via `Subscribe`, or a `Subscriptions` instance for ultimate convenience.

## Installation

```
npm i subscribe-events
```

## Quick Start

Create an instance of the `Subscriptions` class and use that to manage subscriptions.

```jsx
import { Subscriptions } from 'subscribe-events';
```

```jsx
// Use this object to subscribe and unsubscribe
const subscriptions = new Subscriptions();

// ➡️ Event emitter subscription
subscriptions.subscribeEvent(eventEmitter, 'my-event', myEventListener);

// ➡️ DOM event subscription
subscriptions.subscribeDOMEvent(document, 'keypress', keyPressListener);

// ➡️ Custom listener interface subscription
subscriptions.subscribe(() => {
  thing.addObserver(thingObserver);
  return () => thing.removeObserver(thingObserver);
});

// ➡️ setTimeout subscription
subscriptions.setTimeout(() => {
  console.log('Timeout fired!');
}, 2000);

// ➡️ setInterval subscription
subscriptions.setInterval(() => {
  console.log('Interval fired!');
}, 1000);

// ➡️ Push a custom unsubscribe function
subscriptions.pushUnsubscribe(() => {
  console.log('Totally custom unsubscribe function!');
});

// You can access all unsub functions directly via `subscriptions.unsubs`
console.log(`There are ${subscriptions.unsubs.length} subscriptions!`);
```

When it's time to unsubscribe all listeners, call `unsubscribeAll()`:

```jsx
// Unsubscribe all listeners with one easy call!
subscriptions.unsubscribeAll();
```

## Example

Since it is a common use case, below is a full example of adding/removing listeners in React using the `Subscriptions` class.

In this example, we will subscribe to an event emitter, a DOM event, and a custom listener interface.

```jsx
import React from 'react';
import { EventEmitter } from 'events';

import { Subscriptions } from 'subscribe-events';

export const eventEmitter = new EventEmitter();
export const MyComponent = (props: any) => {
  React.useEffect(() => {
    // Listener functions
    const myEventListener = () => {
      console.log('My event fired!');
    };
    const keyPressListener = (e: any) => {
      console.log('Key pressed!', e);
    };
    const bodySizeListener = (e: any) => {
      console.log('Body size changed!', e);
    };

    // Use this object to subscribe and unsubscribe
    const subscriptions = new Subscriptions();

    // ➡️ Event emitter subscription
    subscriptions.subscribeEvent(eventEmitter, 'my-event', myEventListener);

    // ➡️ DOM event subscription
    subscriptions.subscribeDOMEvent(document, 'keypress', keyPressListener);

    // ➡️ Custom listener interface subscription
    subscriptions.subscribe(() => {
      const resizeObserver = new ResizeObserver(bodySizeListener);
      const targetElement = document.getElementsByTagName('body')[0];
      resizeObserver.observe(targetElement);
      return () => resizeObserver.unobserve(targetElement);
    });

    // ➡️ setTimeout subscription
    subscriptions.setTimeout(() => {
      console.log('Timeout fired!');
    }, 2000);

    // ➡️ setInterval subscription
    subscriptions.setInterval(() => {
      console.log('Interval fired!');
    }, 1000);

    // You can access all unsub functions directly via `subscriptions.unsubs`
    console.log(`There are ${subscriptions.unsubs.length} subscriptions!`);

    // Unsubscribe all listeners with one easy call!
    return () => subscriptions.unsubscribeAll();
  }, []);

  // ...

  return <div>My Component!</div>;
};
```

## Static Functions

If you'd like to call the functions used by `Subscriptions` manually, you can use the static functions available in the `Subscribe` class:

```js
import { Subscribe } from 'subscribe-events';
```

Call any of the following:

- `Subscribe.subscribe` - Call provided function to subscribe to an event and return an unsubscribe function.
- `Subscribe.subscribeEvent` - Subscribe to an emitter event and return an unsubscribe function.
- `Subscribe.subscribeDOMEvent` - Subscribe to a DOM event and return an unsubscribe function.
- `Subscribe.setTimeout` - Create a subscription using `setTimeout`, return an unsubscribe function.
- `Subscribe.setInterval` - Create a subscription using `setInterval`, return an unsubscribe function.
- `Subscribe.unsubscribeAll` - Call all provided unsubscribe functions (array or single unsubscribe).

See the JS docs for each for more details.

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

## Icon Attribution

Icon by [Twemoji](https://github.com/twitter/twemoji).

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/subscribe-events/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/subscribe-events/stargazers): [👉⭐](https://github.com/justinmahar/subscribe-events/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/subscribe-events/?path=/story/license--page).