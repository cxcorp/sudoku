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
}

const isClearKey = (key: string) => key === 'Backspace' || key === 'Delete'
const isNumberKey = (key: string) => /[1-9]/.test(key)

const SudokuCell = ({
  value,
  onValueChange,
  onFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber
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
    'sudoku__cell--emphasize-number': shouldEmphasizeNumber(value)
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
}

const SudokuRow = ({
  row,
  onCellValueChange,
  onCellFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber
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
}

const Sudoku = ({
  grid,
  onGridValueChange,
  onCellFocus,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber
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

  return (
    <div className="app">
      <Sudoku
        grid={grid}
        onGridValueChange={handleGridValueChange}
        onCellFocus={handleCellFocus}
        shouldEmphasizeBackground={shouldEmphasizeBackground}
        shouldEmphasizeNumber={shouldEmphasizeNumber}
      />
    </div>
  )
}

export default App
