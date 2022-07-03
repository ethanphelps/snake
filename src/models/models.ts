export interface DirectionVector {
  x: VectorElementValue
  y: VectorElementValue
}

// only want to point up, down, left or right so we only need 0, 1, -1 as values for direction vectors
export type VectorElementValue = 0 | 1 | -1

// using a class to emulate an enum of object literals
export class Directions {
  static readonly Up: DirectionVector = { x: 0, y: -1 }
  static readonly Down: DirectionVector = { x: 0, y: 1 }
  static readonly Left: DirectionVector = { x: -1, y: 0 }
  static readonly Right: DirectionVector = { x: 1, y: 0 }
}

export interface Position {
  x: number 
  y: number 
}