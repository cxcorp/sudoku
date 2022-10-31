import React, { forwardRef } from 'react'
import classes from 'classnames'
import { CellType, RowType, GridType, Coordinate, EMPTY_CELL } from './types'

interface SudokuCellProps {
  value: CellType
  isInitialCell: boolean
  onClick: () => void
  onFocus: () => void
  onBlur: () => void
  shouldEmphasizeBackground: (value: CellType) => boolean
  shouldEmphasizeNumber: (value: CellType) => boolean
  shouldHighlightError: (value: CellType) => boolean
}

const SudokuCell = ({
  value,
  isInitialCell,
  onClick,
  onFocus,
  onBlur,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber,
  shouldHighlightError,
}: SudokuCellProps) => {
  const className = classes('sudoku-board-cell', {
    'sudoku-board-cell--emphasize-bg': shouldEmphasizeBackground(value),
    'sudoku-board-cell--emphasize-number': shouldEmphasizeNumber(value),
    'sudoku-board-cell--error': shouldHighlightError(value),
    'sudoku-board-cell--initial': isInitialCell,
  })

  return (
    <td className={className}>
      <button
        className="sudoku-board-cell__input"
        type="button"
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {value === EMPTY_CELL ? '' : value}
      </button>
    </td>
  )
}

interface SudokuRowProps {
  row: RowType
  isInitialCell: (column: number) => boolean
  onCellClick: (column: number) => void
  onCellFocus: (column: number) => void
  onCellBlur: () => void
  shouldEmphasizeBackground: (column: number, value: CellType) => boolean
  shouldEmphasizeNumber: (column: number, value: CellType) => boolean
  shouldHighlightError: (column: number, value: CellType) => boolean
}

const SudokuRow = ({
  row,
  isInitialCell,
  onCellClick,
  onCellFocus,
  onCellBlur,
  shouldEmphasizeBackground,
  shouldEmphasizeNumber,
  shouldHighlightError,
}: SudokuRowProps) => {
  return (
    <tr className="sudoku-board__row">
      {row.map((cell, index) => (
        <SudokuCell
          key={index}
          value={cell}
          isInitialCell={isInitialCell(index)}
          onClick={() => onCellClick(index)}
          onFocus={() => onCellFocus(index)}
          onBlur={onCellBlur}
          shouldEmphasizeBackground={(value) =>
            shouldEmphasizeBackground(index, value)
          }
          shouldEmphasizeNumber={(value) => shouldEmphasizeNumber(index, value)}
          shouldHighlightError={(value) => shouldHighlightError(index, value)}
        />
      ))}
    </tr>
  )
}

interface SudokuProps {
  className?: string
  grid: GridType
  isInitialCell: (coords: Coordinate) => boolean
  onCellClick: (coords: Coordinate) => void
  onCellFocus: (row: number, column: number) => void
  onCellBlur: () => void
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

export const SudokuBoard = forwardRef<HTMLTableElement, SudokuProps>(
  (
    {
      className,
      grid,
      isInitialCell,
      onCellClick,
      onCellFocus,
      onCellBlur,
      shouldEmphasizeBackground,
      shouldEmphasizeNumber,
      shouldHighlightError,
    },
    ref
  ) => {
    return (
      <table className={classes('sudoku-board', className)} ref={ref}>
        <tbody>
          {grid.map((row, index) => (
            <SudokuRow
              key={index}
              row={row}
              isInitialCell={(column) => isInitialCell([column, index])}
              onCellClick={(column) => onCellClick([column, index])}
              onCellFocus={(column) => onCellFocus(index, column)}
              onCellBlur={onCellBlur}
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
)
