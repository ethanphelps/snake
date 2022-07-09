export const gameUpdate = (eventName: string, detail?: Object): CustomEvent => {
  return new CustomEvent(eventName, {
    bubbles: true,
    cancelable: false,
    composed: true,
  })
}