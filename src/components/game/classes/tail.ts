import { Position } from "../../../models/models";

export class Tail {
  elements: Position[] = []
  head: number = 0
  tail: number = 0

  enqueue(element: Position) {
    this.elements[this.tail] = element
    this.tail++
  }
  
  // dequeue
}