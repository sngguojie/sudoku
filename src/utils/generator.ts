import { cloneDeep, shuffle } from "lodash"
import { solvedPuzzle } from "./constants"
import { calculateValidMoves, getSolutions } from "./solver"

const randomIndex = (length: number) => Math.floor(Math.random() * length)

type SwapType = {
  type: "row" | "column"
  size: "small" | "medium"
  multiplier: number
  swapPair: number[]
}

const generateSwaps = () => {
  let types: ("row" | "column")[] = ["row", "column"]
  let size: ("small" | "medium")[] = ["small", "medium"]
  let swapPairs = [
    [0,1],
    [1,2],
    [0,2],
  ]
  let result: SwapType[] = []
  types.forEach(t => {
    size.forEach(s => {
      let multipliers = s === "small" ? [0,1,2] : [0]
      multipliers.forEach(m => {
        swapPairs.forEach(swapPair => {
          result.push({
            type: t,
            size: s,
            multiplier: m,
            swapPair,
          })
        })
      })
    })
  })
  return result
}

const swaps = generateSwaps()

const swapRows = (puzzle: number[][], i: number, j: number) => {
  let temp = puzzle[i]
  puzzle[i] = puzzle[j]
  puzzle[j] = temp
}

const swapBigRows = (puzzle: number[][], i: number, j: number) => {
  swapRows(puzzle, i*3,j*3)
  swapRows(puzzle, i*3+1,j*3+1)
  swapRows(puzzle, i*3+2,j*3+2)
}

const getColumn = (puzzle: number[][], i: number) => {
  return puzzle.map(row => row[i])
}

const setColumn = (puzzle: number[][], i: number, column: number[]) => {
  for (let rowIndex = 0; rowIndex < 9; rowIndex ++) {
    puzzle[rowIndex][i] = column[rowIndex]
  }
}

const swapColumns = (puzzle: number[][], i: number, j: number) => {
  let temp = getColumn(puzzle, i)
  setColumn(puzzle, i, getColumn(puzzle, j))
  setColumn(puzzle, j, temp)
}

const swapBigColumns = (puzzle: number[][], i: number, j: number) => {
  swapColumns(puzzle, i*3,j*3)
  swapColumns(puzzle, i*3+1,j*3+1)
  swapColumns(puzzle, i*3+2,j*3+2)
}

const applySwap = (puzzle: number[][], swap: SwapType) => {
  const { type, size, multiplier, swapPair } = swap
  let [i, j] = swapPair.map(i => (multiplier * 3) + i)
  if (type === 'row') {
    if (size === 'small') {
      swapRows(puzzle, i, j)
    } else {
      swapBigRows(puzzle, i, j)
    }
  } else {
    if (size === 'small') {
      swapColumns(puzzle, i, j)
    } else {
      swapBigColumns(puzzle, i, j)
    }
  }
}

export const generateSolvedPuzzle = () => {
  let board = cloneDeep(solvedPuzzle)
  let iterations = Math.floor(Math.random() * 100)
  while (iterations > 0) {
    let randomSwap = swaps[randomIndex(swaps.length)]
    applySwap(board, randomSwap)
    iterations--
  }
  return board
}

const getUndoableMoves = (puzzle: number[][]): number[][] => {
  return puzzle.flatMap((row, rowIndex) => {
    return row.map((n, colIndex) => {
      if (n !== 0) {
        return [rowIndex, colIndex, n]
      } else {
        return []
      }
    })
  }).filter(move => move.length > 0)
}

export const generateUnsolvedTruePuzzle = (solvedPuzzle: number[][], maxIterations: number=60) => {
  let puzzle = solvedPuzzle.map(r => [...r])

  let solutionsStore: {[puzzle: string]: string[] } = {}

  let iteration = 0
  while (iteration < maxIterations) {
    iteration ++

    let removed = false
    
    // Moves that can be removed if they lead to multiple solutions
    let undoableMoves = getUndoableMoves(puzzle)
    undoableMoves = shuffle(undoableMoves)

    // iterate through the moves and try remove squares
    for (let i in undoableMoves) {
      let [rowIndex, colIndex, n] = undoableMoves[i]
      
      // Remove square
      puzzle[rowIndex][colIndex] = 0
      
      // if unsolvable after removal, add back square and try next move
      let { unsolveable } = calculateValidMoves(puzzle)
      if (unsolveable) {
        puzzle[rowIndex][colIndex] = n
        continue
      }
      
      // if not unsolvable, get solutions
      let solutions = getSolutions(puzzle, 2, solutionsStore)
      // if there is exactly 1 solution (ie true puzzle) skip rest of the moves
      if (solutions.length === 1) {
        removed = true
        break
      } else {
        // If there is no solution, or multiple solutions, add back square and try next move
        puzzle[rowIndex][colIndex] = n
      }
    }
    // If we go through all the moves and no square can be removed, return the puzzle
    if (!removed) {
      break
    }
  }
  return puzzle
}
