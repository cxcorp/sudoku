import { GridType, EMPTY_CELL, CellType } from '../types'

const u: CellType = EMPTY_CELL

export const initialGrid: GridType = [
  [4, u, u, u, u, 3, 6, 8, u],
  [3, u, 9, u, 8, 7, u, u, 5],
  [u, u, u, u, u, u, u, 7, 3],
  [1, u, 6, u, 3, 2, 5, u, u],
  [8, 9, u, u, u, u, u, 3, 4],
  [u, u, 7, 9, 4, u, 8, u, 1],
  [9, 2, u, u, u, u, u, u, u],
  [6, u, u, 4, 2, u, 7, u, 8],
  [u, 1, 4, 3, u, u, u, u, 2],
]
