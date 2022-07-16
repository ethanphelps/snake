/**
 * Wrapper around window.dispatchEvent for dispatching custom events 
 * @param eventName name of the event to be dispatched
 * @param detail the optional detail parameter to add to the CustomEvent
 */
export const broadcastGameUpdate = (
  eventName: string,
  detail?: Object
): void => {
  window.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: detail,
    })
  );
};

/**
 * Wrapper around adding an event listener for a CustomEvent to the window.  
 * @param eventName name of the event to listen for
 * @param callback the function to be called when this event is received
 */
export const listenFor = (eventName: string, callback: Function): void => {
  window.addEventListener(eventName, (e: Event) => {
    if (e instanceof CustomEvent) {
      callback(e);
    }
  });
};

/**
 * Wrapper for removing a CustomEvent event listner 
 * Fixes the error: 
 *    Type 'Event' is missing the following properties from type 'CustomEvent<any>': detail, initCustomEvent
 * @param eventName name of the event to remove a listener for
 * @param callback the function passed to window.addEventListener
 */
export const removeCustomListener = (
  eventName: string,
  callback: Function
): void => {
  window.removeEventListener(eventName, (e: Event) => {
    if (e instanceof CustomEvent) {
      callback(e);
    }
  });
};

/**
 *
 * @returns the canvas element returned by the game-component web component. document.getElementById can't search into shadow DOMs, so
 * we have to get the shadowRoot of each lit element component and query them individually to get the canvas
 */
export const getCanvas = (): HTMLCanvasElement => {
  let canvas = document
    .getElementById("root")
    ?.shadowRoot?.getElementById("game-component")
    ?.shadowRoot?.getElementById("snakeCanvas") as HTMLCanvasElement;
  return canvas;
}