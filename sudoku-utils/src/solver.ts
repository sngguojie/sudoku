import { cloneDeep, uniq } from "lodash"
import { applyMove } from "./common"
import { numbers } from "./constants"

// Array of [rowIndex, colIndex]
// [[0,0], [0,1]...]
const puzzleIndexes = Array.from(Array(9).keys()).flatMap(rowIndex => {
  return Array.from(Array(9).keys()).map(colIndex => [rowIndex, colIndex])
})

export const isSolved = (puzzle: number[][]) => {
  const collection: number[] = Array.from({ length: 9 }, () => 0)
  for (let i in puzzleIndexes) {
    let [rowIndex, colIndex] = puzzleIndexes[i]
    let n = puzzle[rowIndex][colIndex]
      // unfilled
      if (n === 0) return false
      collection[n-1] += 1
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
  let invalidNumbers: number[] = uniq([...row, ...column, ...square])
  invalidNumbers = invalidNumbers.sort()
  // filter out invalid numbers
  return numbers.filter(n => !invalidNumbers.includes(n))
}

// validMoves: number[][][] => at each rowIndex/colIndex, it has the array of numbers that do not diretly conflict with the rest of the puzzle
// countToSquares: number[][][]
// - If a Square (type: [rowIndex, colIndex]) has n valid numbers, it will be in the array countToSquares[n]
// - This is initialized as a array of size 10, since there can only be 0 - 9 possible remaining valid numbers in a square
// unsolvable: boolean => If there is a square where there are no valid moves, this is false.
export const calculateValidMoves = (puzzle: number[][]): { validMoves: number[][][], countToSquares: number[][][], unsolveable: boolean } => {
  const length = 9
  let validMoves: number[][][] = Array.from({ length }, () => Array.from({ length }, () => []))
  let countToSquares: number[][][] = Array.from({ length: 10 }, () => [])
  let unsolveable = false
  for (let i in puzzleIndexes) {
    let [rowIndex, colIndex] = puzzleIndexes[i]
    if (puzzle[rowIndex][colIndex] === 0) {
      validMoves[rowIndex][colIndex] = calculateValidMovesForSquare(puzzle, rowIndex, colIndex)
      let numValidMoves = validMoves[rowIndex][colIndex].length
      countToSquares[numValidMoves].push([rowIndex, colIndex])
      if (numValidMoves === 0) {
        unsolveable = true
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
  let { unsolveable, countToSquares, validMoves } = calculateValidMoves(puzzle)
  if (unsolveable) {
    storeSolutions([])
    return []
  }
  let sortedSquares = [...countToSquares].flat()
  let solutions: string[] = []
  let [rowIndex, colIndex] = sortedSquares[0]
  let nextMoves = validMoves[rowIndex][colIndex].map(n => [rowIndex, colIndex, n])
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