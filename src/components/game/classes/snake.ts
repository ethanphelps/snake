import { FoodColor } from "../../../models/enums"
import { BLOCK_SIZE } from "../../../config/constants"
import { Directions, DirectionVector, Position } from "../../../models/models"


/**
 * The Snake's body is implemented as a Queue that is constantly being dequeued each 'tick' UNLESS the
 * snake is consuming food during this tick. If the snake is consuming food, then we skip the dequeue 
 * which allows the snake to grow. The snake moves by having body enqueued every tick
 * 
 * note: this could just be added to the Snake class instead of being implemented as a separate class?
 *      or make a base snake class that doesn't respond to user input and then subclass it to make a
 *      Player class
 */
export class Snake {
  x: number // measured in blocks
  y: number // measured in blocks
  color: string
  context: CanvasRenderingContext2D
  direction: DirectionVector = Directions.Up
  body: Position[]
  head: number = 0 // head is the 'front' of the queue where elements get dequeued, but is the back of snake
  tail: number = 1 // counterintuitively, tail is one past the 'head' of the snake, but also the 'back' of the queue where new elements are added

  constructor(x: number, y: number, color: string, context: CanvasRenderingContext2D) {
    this.x = x
    this.y = y
    this.color = color
    this.context = context
    this.body = [ {x: this.x, y: this.y }] // body is a "queue" data structure - enqueueing most recent element to front and dequeueing from end (unless food just eaten)

    document.addEventListener('keydown', this.changeDirection.bind(this))
  }


  draw() {
    // this.context.beginPath()
    // this.context.fillStyle = FoodColor.green
    // this.context.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    
    // loop through body and draw each segment of the body
    for(let element of this.body) {
      this.context.beginPath()
      this.context.fillStyle = FoodColor.green
      this.context.fillRect(element.x * BLOCK_SIZE, element.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    }
  }


  enqueue(element: Position) {
    this.body[this.tail] = element
    this.tail++ // moving tail marker forward in the array
  }

  
  dequeue() {
    // const element = this.body[this.head]
    // this.body.splice(this.head, 1)
    // this.head++ // moving head marker forward in the array
    // this.body.shift()
    this.body = this.body.slice(1)
    console.log(this.body.length)
  }


  /**
   * changes position based on current direction vector value
   */
  move() {
    this.x += this.direction.x 
    this.y += this.direction.y
  }


  /**
   * eventually have keypress change the "direction vector" of the snake 
   * @param e KeyboardEvent emmitted by key press
   */
  changeDirection(e: KeyboardEvent) {
    if(e.key == 'w' || e.key == 'ArrowUp') {
      // this.y -= 1    
      this.direction = Directions.Up
    } else if(e.key == 's' || e.key == 'ArrowDown') {
      // this.y +=1
      this.direction = Directions.Down
    } else if(e.key == 'a' || e.key == 'ArrowLeft') {
      // this.x -=1
      this.direction = Directions.Left
    } else if(e.key == 'd' || e.key == 'ArrowRight') {
      // this.x +=1
      this.direction = Directions.Right
    }
    // console.log(this.direction)
    // console.log(`${this.x} , ${this.y}`)
  }
}