import { FoodColor } from "../../../models/enums";
import { BLOCK_SIZE } from "../../../config/constants";
import { Directions, DirectionVector, Position } from "../../../models/models";
import CoordinateSet from "./coordinateSet";

/**
 * The Snake's body is implemented as a Queue that is constantly being dequeued each 'tick' UNLESS the
 * snake is consuming food during this tick. If the snake is consuming food, then we skip the dequeue
 * which allows the snake to grow. The snake moves by having body enqueued and dequeued every tick
 *
 * note: this could just be added to the Snake class instead of being implemented as a separate class?
 *      or make a base snake class that doesn't respond to user input and then subclass it to make a
 *      Player class
 */
export default class Snake {
  x: number; // measured in blocks
  y: number; // measured in blocks
  color: string;
  context: CanvasRenderingContext2D;
  direction: DirectionVector = Directions.Up;
  body: Position[];
  head: number = 0; // head is the 'front' of the queue where elements get dequeued, but is the back of snake
  tail: number = 1; // counterintuitively, tail is one past the 'head' of the snake, but also the 'back' of the queue where new elements are added
  justAteFood: boolean = false;

  constructor(
    x: number,
    y: number,
    color: string,
    context: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.context = context;
    this.body = [{ x: this.x, y: this.y }]; // body is a "queue" data structure - enqueueing most recent element to front and dequeueing from end (unless food just eaten)
    this.tail = this.body.length;

    console.log('new snake!')

    document.addEventListener("keydown", this.changeDirection.bind(this));
  }

  draw() {
    for (let element of this.body) {
      this.context.beginPath();
      this.context.fillStyle = FoodColor.green;
      this.context.fillRect(
        element.x * BLOCK_SIZE,
        element.y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }

  enqueue(element: Position, occupiedCoordinates: CoordinateSet) {
    occupiedCoordinates.add(element.x, element.y); // add new element's coordinates to occupied coordinates set
    this.body[this.tail] = element;
    this.tail++; // moving tail marker forward in the array
  }

  // removes element from tail of snake which is front of body array
  dequeue(occupiedCoordinates: CoordinateSet) {
    occupiedCoordinates.remove(this.body[0].x, this.body[0].y); // remove last body element's coordinates from occupied coordinates set
    this.body = this.body.slice(1);
    this.tail--; // move tail marker back to be one past the snake's "head"
  }

  /**
   * changes position based on current direction vector value
   */
  move() {
    this.x += this.direction.x;
    this.y += this.direction.y;
    console.log(`moved: ${this.x}, ${this.y}`)
  }

  /**
   * changes this.direction with a new direction vector only if the new direction won't
   * cause the snake to move on top of itself
   * @param e KeyboardEvent emmitted by key press
   */
  changeDirection(e: KeyboardEvent) {
    if (
      (e.key == "w" || e.key == "ArrowUp") &&
      (this.body.length == 1 || this.direction != Directions.Down)
    ) {
      this.direction = Directions.Up;
    } else if (
      (e.key == "s" || e.key == "ArrowDown") &&
      (this.body.length == 1 || this.direction != Directions.Up)
    ) {
      this.direction = Directions.Down;
    } else if (
      (e.key == "a" || e.key == "ArrowLeft") &&
      (this.body.length == 1 || this.direction != Directions.Right)
    ) {
      this.direction = Directions.Left;
    } else if (
      (e.key == "d" || e.key == "ArrowRight") &&
      (this.body.length == 1 || this.direction != Directions.Left)
    ) {
      this.direction = Directions.Right;
    }
  }

  /**
   *
   * @returns this.body as a pretty printed string for debugging
   */
  bodyToString() {
    let result = "[";
    // iterate in reverse since 'head' is at end of arary
    for (let i = this.body.length - 1; i >= 0; i--) {
      result += ` (${this.body[i].x},${this.body[i].y}),`;
    }
    result += " ]";
    return result;
  }
}
