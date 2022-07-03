import { FoodColor } from "../../../models/enums";
import { BLOCK_SIZE } from "../../../config/constants";
import { Directions, DirectionVector, Position } from "../../../models/models";
import Snake from "./snake";

export class Player extends Snake {
  // x: number // measured in blocks
  // y: number // measured in blocks
  // color: string
  // context: CanvasRenderingContext2D
  direction: DirectionVector = Directions.Up;
  // body: Position[]

  constructor(
    x: number,
    y: number,
    color: string,
    context: CanvasRenderingContext2D
  ) {
    super(x, y, color, context);
    // this.x = x
    // this.y = y
    // this.color = color
    // this.context = context
    this.body = [{ x: this.x, y: this.y }]; // tail is a "queue" data structure - enqueueing most recent element to front and dequeueing from end (unless food just eaten)

    document.addEventListener("keydown", this.changeDirection.bind(this));
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = FoodColor.green;
    this.context.fillRect(
      this.x * BLOCK_SIZE,
      this.y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }

  /**
   * changes position based on current direction vector value
   */
  move() {
    this.x += this.direction.x;
    this.y += this.direction.y;
  }

  /**
   * eventually have keypress change the "direction vector" of the snake
   * @param e KeyboardEvent emmitted by key press
   */
  changeDirection(e: KeyboardEvent) {
    if (e.key == "w" || e.key == "ArrowUp") {
      // this.y -= 1
      this.direction = Directions.Up;
    } else if (e.key == "s" || e.key == "ArrowDown") {
      // this.y +=1
      this.direction = Directions.Down;
    } else if (e.key == "a" || e.key == "ArrowLeft") {
      // this.x -=1
      this.direction = Directions.Left;
    } else if (e.key == "d" || e.key == "ArrowRight") {
      // this.x +=1
      this.direction = Directions.Right;
    }
    // console.log(this.direction)
    // console.log(`${this.x} , ${this.y}`)
  }
}
