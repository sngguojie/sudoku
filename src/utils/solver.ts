import { cloneDeep } from "lodash"
import { applyMove } from "./common"
import { numbers } from "./constants"

export const isSolved = (puzzle: number[][]) => {
  const collection: number[] = Array.from({ length: 9 }, () => 0)
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      let n = puzzle[rowIndex][colIndex]
      // unfilled
      if (n === 0) return false
      collection[n-1] += 1
    }
  }
  return collection.every(count => count === 9)
}

const getSquareIndexes = (rowIndex: number, colIndex: number) => {
  let largeRowIndex = Math.floor(rowIndex / 3)
  let largeColIndex = Math.floor(colIndex / 3)
  let result = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result.push([largeRowIndex*3+i, largeColIndex*3+j])
    }
  }
  return result
}

const getSquare = <T>(data: T[][] | T[][][], rowIndex: number, colIndex: number) => {
  return getSquareIndexes(rowIndex, colIndex).map(([r, c]) => data[r][c])
}

const calculateValidMovesForSquare = (puzzle: number[][], rowIndex: number, colIndex: number) => {
  const row = puzzle[rowIndex]
  // check columns
  const column = puzzle.map(row => row[colIndex])
  // check square
  const square = getSquare<number>(puzzle, rowIndex, colIndex) as number[]
  // combine and uniq
  const invalidNumbers: number[] = []
  row.forEach(n => {
    if (!invalidNumbers.includes(n)) {
      invalidNumbers.push(n)
    }
  })
  column.forEach(n => {
    if (!invalidNumbers.includes(n)) {
      invalidNumbers.push(n)
    }
  })
  square.forEach(n => {
    if (!invalidNumbers.includes(n)) {
      invalidNumbers.push(n)
    }
  })
  invalidNumbers.sort()
  // filter out invalid numbers
  return numbers.filter(n => !invalidNumbers.includes(n))
}

export const calculateValidMoves = (puzzle: number[][]): { validMoves: number[][][], countToSquares: number[][][], unsolveable: boolean } => {
  const length = 9
  let validMoves: number[][][] = Array.from({ length }, () => Array.from({ length }, () => []))
  let countToSquares: number[][][] = Array.from({ length: 10 }, () => [])
  let unsolveable = false
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      if (puzzle[rowIndex][colIndex] === 0) {
        validMoves[rowIndex][colIndex] = calculateValidMovesForSquare(puzzle, rowIndex, colIndex)
        let numValidMoves = validMoves[rowIndex][colIndex].length
        countToSquares[numValidMoves].push([rowIndex, colIndex])
        if (numValidMoves === 0) {
          unsolveable = true
        }
      }
    }
    
  }

  return { validMoves, countToSquares, unsolveable }
}

// There are 3 possible outcomes: 
// - There are no solutions => returns empty array
// - There is exactly 1 solution => returns array of 1 with JSON stringified number[][]
// - There is more than 1 solution => returns array of 2 with JSON stringified number[][] of first 2 solutions found
export const getSolutions = (puzzle: number[][], maxSolutions: number=2, solutionsStore?: { [puzzle: string]: string[] }) => {
  if (solutionsStore !== undefined && solutionsStore[JSON.stringify(puzzle)] !== undefined) {
    return solutionsStore[JSON.stringify(puzzle)]
  }
  const storeSolutions = (solutions: string[]) => {
    if (solutionsStore !== undefined) {
      solutionsStore[JSON.stringify(puzzle)] = solutions
    }
  }
  if (isSolved(puzzle)) {
    let solutions = [JSON.stringify(puzzle)]
    storeSolutions(solutions)
    return solutions
  }
  // let naiveSolutions = naiveSolver(puzzle)
  // if (naiveSolutions.length > 0) {
  //   storeSolutions(naiveSolutions)
  //   return naiveSolutions
  // }
  let memo = calculateValidMoves(puzzle)
  if (memo.unsolveable) {
    storeSolutions([])
    return []
  }
  let sortedSquares = [...memo.countToSquares].flat()
  let solutions: string[] = []
  let [rowIndex, colIndex] = sortedSquares[0]
  let nextMoves = memo.validMoves[rowIndex][colIndex].map(n => [rowIndex, colIndex, n])
  for (let i in nextMoves) {
    let nextMove = nextMoves[i]
    let nextPuzzleState = applyMove(cloneDeep(puzzle), nextMove)
    let currentSolutions = getSolutions(nextPuzzleState, maxSolutions, solutionsStore)
    currentSolutions.forEach(s => {
      if (!solutions.includes(s)) {
        solutions.push(s)
      }
    })
    if (solutions.length >= maxSolutions) {
      storeSolutions(solutions)
      return solutions
    }
  }
  storeSolutions(solutions)
  return solutions
}

export const naiveSolver = (puzzle: number[][]): string[] => {
  if (isSolved(puzzle)) {
    return [JSON.stringify(puzzle)]
  }

  const { countToSquares, validMoves } = calculateValidMoves(puzzle)
  if (countToSquares[1].length > 0) {
    let [rowIndex, colIndex] = countToSquares[1][0]
    let copy = cloneDeep(puzzle)
    applyMove(copy, [rowIndex, colIndex, validMoves[rowIndex][colIndex][0]])
    return naiveSolver(copy)
  } else {
    return []
  }
}
