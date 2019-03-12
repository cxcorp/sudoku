// [x, y]
export type Coordinate = [number, number]

export const EMPTY_CELL = Symbol()
export type EmptyCell = typeof EMPTY_CELL

export type CellType = number | EmptyCell

export type RowType = CellType[]

export type GridType = RowType[]
