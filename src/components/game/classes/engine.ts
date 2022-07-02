import { BLOCK_SIZE, MAP_SIZE, SNAKE_SPEED } from "../../../config/constants";
import { FoodColor } from "../../../models/enums";
import { SnakeGame } from "../game.component";
import { Food } from "./food"; 
import { Snake } from "./snake";


export class GameEngine {
  food: Food[]
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D 
  player: Snake
  lastestRenderTimestamp: number = 1


  constructor() {
    this.food = [] 
    this.canvas = this.getCanvas()
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.player = this.createSnake(20, 10, FoodColor.green)
    this.player.draw()
    this.createFood(4)

    this.gameLoop(0)
  }

  /**
   * 
   * @param now timestamp of the current time in this animation frame
   */
  gameLoop(now: DOMHighResTimeStamp) {
    //clear the canvas every frame
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // ----  other tasks
    // update snake position every SNAKE_SPEED ms
    if(!this.lastestRenderTimestamp || now - this.lastestRenderTimestamp >= SNAKE_SPEED) {
      this.lastestRenderTimestamp = now


      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.player.move()
      // once position updated, enqueue new segment at player.x, player.y,this
      this.player.enqueue({ x: this.player.x, y: this.player.y})
      // check if previous position was on a food piece: if so, skip dequeue(). otherwise, dequeue()
      this.player.dequeue()
    }


    // ---- redraw stuff every frame
    this.player.draw()
    for(let i in this.food) {
      this.food[i].draw() 
    }

    requestAnimationFrame(this.gameLoop.bind(this)) // bind 'this' keyword to GameEngine class
  }


  createSnake(x: number, y: number, color: FoodColor) {
    return new Snake(x, y, color, this.context)
  }


  /**
   * 
   * @returns the canvas element returned by the game-component web component. document.getElementById can't search into shadow DOMs, so
   * we have to get the shadowRoot of each lit element component and query them individually to get the canvas
   */
  getCanvas(): HTMLCanvasElement {
    let canvas = document.getElementById('root')?.shadowRoot?.getElementById('game-component')?.shadowRoot?.getElementById('snakeCanvas') as HTMLCanvasElement
    // console.log(canvas)
    return canvas 
  }


  createFood(count: number) {
    for(let i = 0; i < count; i++) {
      let food = new Food(this.randomMapLocation(), this.randomMapLocation(), this.context)
      this.food.push(food)
    }
  }


  randomMapLocation(): number {
    let random =  Math.floor(Math.random() * MAP_SIZE)
    return random * BLOCK_SIZE
  }
}