import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import { CellType, GridType, Coordinate, EMPTY_CELL } from './types'
import { SudokuBoard } from './Sudoku'
import { sudoku } from './sudoku'
import classes from 'classnames'

const updateCell = (grid: GridType, coords: Coordinate, value: CellType) => {
  const [x, y] = coords
  const updatedRow: CellType[] = [...grid[y]]
  updatedRow[x] = value

  const updatedGrid = [...grid]
  updatedGrid[y] = updatedRow

  return updatedGrid
}

const hasSameNumberOnSameRow = (
  grid: GridType,
  row: number,
  column: number,
  value: number
) => {
  return grid[row].some((candidate, candidateColumn) => {
    return candidate === value && candidateColumn !== column
  })
}

const getColumnValues = (grid: GridType, column: number) => {
  const values = []
  for (let row = 0; row < 9; row++) {
    values.push(grid[row][column])
  }
  return values
}

const hasSameNumberOnSameColumn = (
  grid: GridType,
  row: number,
  column: number,
  value: number
) => {
  return getColumnValues(grid, column).some(
    (candidate, candidateRow) => candidate === value && candidateRow !== row
  )
}

const squareIndex = (idx: number) => Math.floor(idx / 3)
const squareBaseIndex = (squareIndex: number) => squareIndex * 3
const squareCoords = (row: number, column: number) => [
  squareBaseIndex(squareIndex(row)),
  squareBaseIndex(squareIndex(column)),
]

const getSquareValues = (grid: GridType, row: number, column: number) => {
  const [squareBaseRow, squareBaseColumn] = squareCoords(row, column)
  const values = []

  for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
    for (let columnOffset = 0; columnOffset < 3; columnOffset++) {
      values.push({
        row: squareBaseRow + rowOffset,
        column: squareBaseColumn + columnOffset,
        value: grid[squareBaseRow + rowOffset][squareBaseColumn + columnOffset],
      })
    }
  }

  return values
}

const hasSameNumberInSameSquare = (
  grid: GridType,
  row: number,
  column: number,
  value: number
) => {
  return getSquareValues(grid, row, column).some(
    (candidate) =>
      candidate.value === value &&
      candidate.row !== row &&
      candidate.column !== column
  )
}

const initialGrid = sudoku
  .board_string_to_grid(sudoku.generate('insane'))
  .map((arr) =>
    arr.map((cell) => (cell === '.' ? EMPTY_CELL : parseInt(cell, 10)))
  )

const isInitialCell = (coords: Coordinate) =>
  initialGrid[coords[1]][coords[0]] !== EMPTY_CELL

const App = () => {
  const boardRef = useRef<HTMLTableElement>(null)

  const [grid, setGrid] = useState<GridType>(initialGrid)
  const [activeCellCoords, setActiveCellCoords] = useState<Coordinate | null>(
    null
  )
  const [activeNumber, setActiveNumber] = useState<number | null>(null)

  const handleCellClick = (coords: Coordinate) => {
    if (activeNumber === null) {
      return
    }
    if (isInitialCell(coords)) {
      // Don't allow editing of initial cells
      return
    }

    setGrid(updateCell(grid, coords, activeNumber))
  }

  const handleCellFocus = (row: number, column: number) => {
    setActiveCellCoords([column, row])
  }

  const handleCellBlur = () => {
    if (boardRef?.current?.contains(document.activeElement)) {
      return
    }
    setActiveCellCoords(null)
  }

  const shouldEmphasizeBackground = (
    row: number,
    column: number,
    value: CellType
  ) => {
    if (!activeCellCoords) {
      return false
    }

    const [activeColumn, activeRow] = activeCellCoords
    return activeColumn === column || activeRow === row
  }

  const shouldEmphasizeNumber = (
    row: number,
    column: number,
    value: CellType
  ) => {
    if (value === EMPTY_CELL) {
      return false
    }

    if (activeCellCoords) {
      const [activeColumn, activeRow] = activeCellCoords
      return grid[activeRow][activeColumn] === value
    }

    return value === activeNumber
  }

  const shouldHighlightError = (
    row: number,
    column: number,
    value: CellType
  ) => {
    if (value === EMPTY_CELL) {
      return false
    }

    return (
      hasSameNumberOnSameRow(grid, row, column, value) ||
      hasSameNumberOnSameColumn(grid, row, column, value) ||
      hasSameNumberInSameSquare(grid, row, column, value)
    )
  }

  return (
    <div className="app">
      <h1>Sudoku</h1>
      <p>
        The daily sudoku. Generate a new sudoku by refreshing
        <br /> the page.
      </p>
      <SudokuBoard
        ref={boardRef}
        className="app__sudoku-board"
        grid={grid}
        isInitialCell={isInitialCell}
        onCellClick={handleCellClick}
        onCellFocus={handleCellFocus}
        onCellBlur={handleCellBlur}
        shouldEmphasizeBackground={shouldEmphasizeBackground}
        shouldEmphasizeNumber={shouldEmphasizeNumber}
        shouldHighlightError={shouldHighlightError}
      />
      <div className="app__number-buttons">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            className={classes('number-button', {
              'number-button--active': activeNumber === number,
            })}
            onClick={() => setActiveNumber(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
