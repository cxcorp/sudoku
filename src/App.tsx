import React, { useState } from 'react'
import classes from 'classnames'
import './App.scss'
import { CellType, RowType, GridType, Coordinate, EMPTY_CELL } from './types'
import { initialGrid } from './data'

interface SudokuCellProps {
  value: CellType
  onValueChange: (newValue: CellType) => void
  onFocus: () => void
  shouldEmphasizeBackground: (value: CellType) => boolean
  shouldEmphasizeNumber: (value: CellType) => boolean
  shouldHighlightError: (value: CellType) => boolean
}

const isClearKey = (key: string) => key === 'Backspace' || key === 'Delete'
const isNumberKey = (key: string) => /[1-9]/.test(key)

const SudokuCell = ({
  value,
  onValueChange,
  onFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber,
  shouldHighlightError
}: SudokuCellProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (isClearKey(e.key)) {
      return onValueChange(EMPTY_CELL)
    }

    if (!isNumberKey(e.key)) {
      return
    }

    const newValue = parseInt(e.key, 10)
    onValueChange(newValue)
  }

  const className = classes('sudoku__cell', {
    'sudoku__cell--emphasize-bg': shouldEmphasizeBackground(value),
    'sudoku__cell--emphasize-number': shouldEmphasizeNumber(value),
    'sudoku__cell--error': shouldHighlightError(value)
  })

  return (
    <td className={className}>
      <input
        className="sudoku__cell-input"
        type="text"
        value={value === EMPTY_CELL ? '' : value}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
      />
    </td>
  )
}

interface SudokuRowProps {
  row: RowType
  onCellValueChange: (column: number, newValue: CellType) => void
  onCellFocus: (column: number) => void
  shouldEmphasizeBackground: (column: number, value: CellType) => boolean
  shouldEmphasizeNumber: (column: number, value: CellType) => boolean
  shouldHighlightError: (column: number, value: CellType) => boolean
}

const SudokuRow = ({
  row,
  onCellValueChange,
  onCellFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber,
  shouldHighlightError
}: SudokuRowProps) => {
  return (
    <tr className="sudoku__row">
      {row.map((cell, index) => (
        <SudokuCell
          key={index}
          value={cell}
          onValueChange={newValue => onCellValueChange(index, newValue)}
          onFocus={() => onCellFocus(index)}
          shouldEmphasizeBackground={value =>
            shouldEmphasizeBackground(index, value)
          }
          shouldEmphasizeNumber={value => shouldEmphasizeNumber(index, value)}
          shouldHighlightError={value => shouldHighlightError(index, value)}
        />
      ))}
    </tr>
  )
}

interface SudokuProps {
  grid: GridType
  onGridValueChange: (coords: Coordinate, newValue: CellType) => void
  onCellFocus: (row: number, column: number) => void
  shouldEmphasizeNumber: (
    row: number,
    column: number,
    value: CellType
  ) => boolean
  shouldEmphasizeBackground: (
    row: number,
    column: number,
    value: CellType
  ) => boolean
  shouldHighlightError: (
    row: number,
    column: number,
    value: CellType
  ) => boolean
}

const Sudoku = ({
  grid,
  onGridValueChange,
  onCellFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber,
  shouldHighlightError
}: SudokuProps) => {
  return (
    <table className="sudoku">
      <tbody>
        {grid.map((row, index) => (
          <SudokuRow
            key={index}
            row={row}
            onCellValueChange={(column, newValue) =>
              onGridValueChange([column, index], newValue)
            }
            onCellFocus={column => onCellFocus(index, column)}
            shouldEmphasizeBackground={(column, value) =>
              shouldEmphasizeBackground(index, column, value)
            }
            shouldEmphasizeNumber={(column, value) =>
              shouldEmphasizeNumber(index, column, value)
            }
            shouldHighlightError={(column, value) =>
              shouldHighlightError(index, column, value)
            }
          />
        ))}
      </tbody>
    </table>
  )
}

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
  squareBaseIndex(squareIndex(column))
]

const getSquareValues = (grid: GridType, row: number, column: number) => {
  const [squareBaseRow, squareBaseColumn] = squareCoords(row, column)
  const values = []

  for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
    for (let columnOffset = 0; columnOffset < 3; columnOffset++) {
      values.push({
        row: squareBaseRow + rowOffset,
        column: squareBaseColumn + columnOffset,
        value: grid[squareBaseRow + rowOffset][squareBaseColumn + columnOffset]
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
    candidate =>
      candidate.value === value &&
      (candidate.row !== row && candidate.column !== column)
  )
}

const App = () => {
  const [grid, setGrid] = useState<GridType>(initialGrid)
  const [activeCellCoords, setActiveCellCoords] = useState<Coordinate | null>(
    null
  )

  const handleGridValueChange = (coords: Coordinate, value: CellType) => {
    setGrid(updateCell(grid, coords, value))
  }

  const handleCellFocus = (row: number, column: number) => {
    setActiveCellCoords([column, row])
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
    if (!activeCellCoords || value === EMPTY_CELL) {
      return false
    }

    const [activeColumn, activeRow] = activeCellCoords
    return grid[activeRow][activeColumn] === value
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
      <Sudoku
        grid={grid}
        onGridValueChange={handleGridValueChange}
        onCellFocus={handleCellFocus}
        shouldEmphasizeBackground={shouldEmphasizeBackground}
        shouldEmphasizeNumber={shouldEmphasizeNumber}
        shouldHighlightError={shouldHighlightError}
      />
    </div>
  )
}

export default App
