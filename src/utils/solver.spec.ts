import { getMemo, getSolutions } from "./solver"
import { solvedPuzzle } from "./constants"

describe("solver",() => {

  describe("getSolutions", () => {
    test("for a solved puzzle", () => {
      let solutions = getSolutions(solvedPuzzle)
      expect(solutions.length).toEqual(1)
      expect(solutions[0]).toEqual(JSON.stringify(solvedPuzzle))
    })
    test("for a puzzle that is one step from being solved", () => {
      for (let rowIndex = 0; rowIndex < 9; rowIndex ++) {
        for (let colIndex = 0; colIndex < 9; colIndex ++) {
          let puzzle = solvedPuzzle.map(row => [...row])
          puzzle[rowIndex][colIndex] = 0
          let solutions = getSolutions(puzzle)
          expect(solutions.length).toEqual(1)
          expect(solutions[0]).toEqual(JSON.stringify(solvedPuzzle))
        }
      }
    })
    test("for a puzzle that has no solutions", () => {
      const unsolvablePuzzle = [
        [1,2,3,4,5,6,7,8,0],
        [0,0,0,0,0,0,0,0,9],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]
      let solutions = getSolutions(unsolvablePuzzle)
      expect(solutions.length).toEqual(0)
    })
    test("for a puzzle that is empty", () => {
      const emptyPuzzle = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]
      let solutions = getSolutions(emptyPuzzle)
      expect(solutions.length).toEqual(2)
    })
    test("for a puzzle that has multiple solutions, we return first 2 solutions", () => {
      // This puzzle has 8 solutions according to 
      // https://www.thonky.com/sudoku/solution-count?puzzle=9.6..1....2.4..58...7289.3.........8..5....12..8.243.55.9...8..6418.59...7.943...
      const mockPuzzle = [
        [9, 0, 6, 0, 0, 1, 0, 0, 0],
        [0, 2, 0, 4, 0, 0, 5, 8, 0],
        [0, 0, 7, 2, 8, 9, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 5, 0, 0, 0, 0, 1, 2],
        [0, 0, 8, 0, 2, 4, 3, 0, 5],
        [5, 0, 9, 0, 0, 0, 8, 0, 0],
        [6, 4, 1, 8, 0, 5, 9, 0, 0],
        [0, 7, 0, 9, 4, 3, 0, 0, 0],
      ]
      let solutions = getSolutions(mockPuzzle)
      expect(solutions.length).toEqual(2)
    })

    test("for a puzzle that has multiple solutions, when we set maxSolutions = 1", () => {
      // This puzzle has 8 solutions according to 
      // https://www.thonky.com/sudoku/solution-count?puzzle=9.6..1....2.4..58...7289.3.........8..5....12..8.243.55.9...8..6418.59...7.943...
      const mockPuzzle = [
        [9, 0, 6, 0, 0, 1, 0, 0, 0],
        [0, 2, 0, 4, 0, 0, 5, 8, 0],
        [0, 0, 7, 2, 8, 9, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 5, 0, 0, 0, 0, 1, 2],
        [0, 0, 8, 0, 2, 4, 3, 0, 5],
        [5, 0, 9, 0, 0, 0, 8, 0, 0],
        [6, 4, 1, 8, 0, 5, 9, 0, 0],
        [0, 7, 0, 9, 4, 3, 0, 0, 0],
      ]
      let solutions = getSolutions(mockPuzzle, 1)
      expect(solutions.length).toEqual(1)
    })
  })
  describe("getMemo", () => {
    test("for a solved puzzle", () => {
      let memo = getMemo(solvedPuzzle)
      expect(memo.unsolveable).toEqual(false)
    })
    test("for a puzzle that is one step from being solved", () => {
      for (let rowIndex = 0; rowIndex < 9; rowIndex ++) {
        for (let colIndex = 0; colIndex < 9; colIndex ++) {
          let puzzle = solvedPuzzle.map(row => [...row])
          puzzle[rowIndex][colIndex] = 0
          let memo = getMemo(puzzle)
          expect(memo.unsolveable).toEqual(false)
        }
      }
    })
    test("for a puzzle that has no solutions", () => {
      const unsolvablePuzzle = [
        [1,2,3,4,5,6,7,8,0],
        [0,0,0,0,0,0,0,0,9],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]
      let memo = getMemo(unsolvablePuzzle)
      expect(memo.validMoves[0][8].length).toEqual(0)
      expect(memo.unsolveable).toEqual(true)
    })
  })
})
