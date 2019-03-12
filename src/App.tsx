import React, { useState } from 'react'
import './App.scss'
import { CellType, RowType, GridType, Coordinate, EMPTY_CELL } from './types'
import { initialGrid } from './data'

interface SudokuCellProps {
  value: CellType
  onValueChange: (newValue: CellType) => void
}

const isClearKey = (key: string) => key === 'Backspace' || key === 'Delete'
const isNumberKey = (key: string) => /[1-9]/.test(key)

const SudokuCell = ({ value, onValueChange }: SudokuCellProps) => {
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

  return (
    <td className="sudoku__cell">
      <input
        className="sudoku__cell-input"
        type="text"
        value={value === EMPTY_CELL ? '' : value}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
      />
    </td>
  )
}

interface SudokuRowProps {
  row: RowType
  onCellValueChange: (column: number, newValue: CellType) => void
}

const SudokuRow = ({ row, onCellValueChange }: SudokuRowProps) => {
  return (
    <tr className="sudoku__row">
      {row.map((cell, index) => (
        <SudokuCell
          key={index}
          value={cell}
          onValueChange={newValue => onCellValueChange(index, newValue)}
        />
      ))}
    </tr>
  )
}

interface SudokuProps {
  grid: GridType
  onGridValueChange: (coords: Coordinate, newValue: CellType) => void
}

const Sudoku = ({ grid, onGridValueChange }: SudokuProps) => {
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

  const handleGridValueChange = (coords: Coordinate, value: CellType) => {
    setGrid(updateCell(grid, coords, value))
  }
  return (
    <div className="app">
      <Sudoku grid={grid} onGridValueChange={handleGridValueChange} />
    </div>
  )
}

export default App
