import { FoodColor } from "../../../models/enums"
import { BLOCK_SIZE } from "../../../config/constants"

export default class Food {
  x: number
  y: number
  color: FoodColor
  c: CanvasRenderingContext2D


  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x
    this.y = y
    this.color = this.randomColor() 
    this.c = context
  }


  draw() {
    this.c.beginPath()
    this.c.fillStyle = this.color 
    this.c.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
  }


  /**
   *  
   * @returns a random color hex string from the FoodColor enum by getting the enum's length, creating a random number from 0 to length-1 and returning the value
   * in the enum associated with that index. 
   */
  randomColor(): FoodColor {
    const numColors = Object.keys(FoodColor).length
    const randomNumber = Math.floor(Math.random() * numColors)
    return Object.values(FoodColor)[randomNumber]
  }
}