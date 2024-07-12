import { CanvasElement } from "./canvas"
import { Jelo } from "./jelo"
export class Restoran{
  konobar: string[]
  address: string
  name: string
  type: string
  grades: number[]
  comments: string[]
  phone: string
  description: string
  menu: Jelo[]
  canvas: CanvasElement[]
  workingTime: { [key: string]: { start: string; end: string } };
}
