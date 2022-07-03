import { BLOCK_SIZE, MAP_SIZE, SNAKE_SPEED, FOOD_RESPAWN_DELAY, FOOD_COUNT } from "../../../config/constants";
import { FoodColor } from "../../../models/enums";
import { SnakeGame } from "../game.component";
import Food from "./food"; 
import Snake from "./snake";
import CoordinateSet from "./coordinateSet";


export class GameEngine {
  food: Food[]
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D 
  player: Snake
  lastestRenderTimestamp: number = 1
  gameOver: boolean = false
  foodCoordinates = new CoordinateSet()


  constructor() {
    this.food = [] 
    this.canvas = this.getCanvas()
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.player = this.createSnake(20, 10, FoodColor.green)
    this.player.draw()
    this.createFood(FOOD_COUNT)

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

      this.player.move()
      // once position updated, enqueue new segment at player.x, player.y,this
      this.player.enqueue({ x: this.player.x, y: this.player.y})
      // check if previous position was on a food piece: if so, skip dequeue(). otherwise, dequeue()
      if(!this.player.justAteFood) {
        this.player.dequeue()
      } else {
        this.player.justAteFood = false // reset so snake doesn't keep growing 
      }

      // check for collisions
      this.checkFoodCollisions()
      this.checkSelfCollisions()
      this.checkOutOfBounds()
    }

    // ---- redraw stuff every frame
    this.player.draw()
    for(let i in this.food) {
      this.food[i].draw() 
    }

    // check for gameOver instead of calling endGame() directly so food gets drawn before game loop stops 
    if(this.gameOver) {
      this.endGame()
      return
    }

    requestAnimationFrame(this.gameLoop.bind(this)) // bind 'this' keyword to GameEngine class
  }

  /**
   * player.x, player.y is the LAST element of player.body, also the first four elements of the
   * snake's body can't touch each other, so we start on the fifth element and iterate backwards
   * through the array to check for self-collision
   *  */ 
  checkSelfCollisions() {
    for(let i = this.player.body.length - 5; i >= 0; i--) {
      if(this.player.body[i].x == this.player.x && this.player.body[i].y == this.player.y) {
        this.gameOver = true
      }
    }
  }

  checkFoodCollisions() {
    for(let i = 0; i < this.food.length; i++) {
      if(this.food[i].x == this.player.x && this.food[i].y == this.player.y) {
        this.player.justAteFood = true  // skip next dequeue
        this.foodCoordinates.remove(this.food[i].x, this.food[i].y) // remove food coordinates from set
        this.food.splice(i, 1) // remove food
        this.newFood() // add new food to replace
        break // don't keep looking for collisions because there should only be one food per block
      }
    }
  }

  checkOutOfBounds() {
    if(this.player.x < 0 || this.player.x >= MAP_SIZE || this.player.y < 0 || this.player.y >= MAP_SIZE) {
      this.gameOver = true
    }
  }

  endGame() {
    console.log('game over!')
  }

  /**
   * adds new food to the map after a delay
   */
  newFood() {
    let foodLocation = { x: this.randomMapLocation(), y: this.randomMapLocation() }
    // don't spawn food on top of other food
    while(this.foodCoordinates.has(foodLocation.x, foodLocation.y)) {
      foodLocation.x = this.randomMapLocation()
      foodLocation.y = this.randomMapLocation()
    }
    // add unique coordinates 
    this.foodCoordinates.add(foodLocation.x, foodLocation.y)
    // put food on the screen after delay
    setTimeout(() =>  {
      this.food.push(new Food(foodLocation.x, foodLocation.y, this.context))
    }, FOOD_RESPAWN_DELAY )
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
      this.foodCoordinates.add(food.x, food.y)
    }
  }


  randomMapLocation(): number {
    let random =  Math.floor(Math.random() * MAP_SIZE)
    return random 
  }
}