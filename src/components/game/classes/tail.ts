import { Position } from "../../../models/models";

/**
 * The Snake's tail is implemented as a Queue that is constantly being dequeued each 'tick' UNLESS the
 * snake is consuming food during this tick. If the snake is consuming food, then we skip the dequeue 
 * which allows the snake to grow. The snake moves by having elements enqueued every tick
 * 
 * note: this could just be added to the Snake class instead of being implemented as a separate class?
 *      or make a base snake class that doesn't respond to user input and then subclass it to make a
 *      Player class
 */
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