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

export const listenFor = (eventName: string, callback: Function): void => {
  window.addEventListener(eventName, (e: Event) => {
    if (e instanceof CustomEvent) {
      callback(e);
    }
  });
};

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
