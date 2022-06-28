import { BLOCK_SIZE, MAP_SIZE } from "../../../config/constants";
import { FoodColor } from "../../../models/enums";
import { Food } from "./food"; 

export class GameEngine {
  food: Food[]
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D 

  constructor() {
    this.food = [] 
    this.canvas = this.getCanvas()
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.createSnake()
    this.createFood(4)
  }

  gameLoop() {

  }

  createSnake() {
    this.context.beginPath()
    this.context.fillStyle = FoodColor.green
    this.context.fillRect(20 * BLOCK_SIZE, 10 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
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
      food.draw()
    }
  }

  randomMapLocation(): number {
    let random =  Math.floor(Math.random() * MAP_SIZE)
    return random * BLOCK_SIZE
  }
}