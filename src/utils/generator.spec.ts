import { solvedPuzzle } from './constants'
import { generateSolvedPuzzle, generateUnsolvedTruePuzzle } from './generator'
import { isSolved } from './solver'

describe("generator",() => {
  describe("generateSolvedPuzzle", () => {
    test("should pass isSolved and generates different puzzles", () => {
      const result = generateSolvedPuzzle()
      expect(isSolved(result))
      const result2 = generateSolvedPuzzle()
      expect(isSolved(result2))
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result2))
    })
  })
  describe("generateUnsolvedTruePuzzle", () => {
    test("should be different from input puzzle and generates different puzzles", () => {
      const result = generateUnsolvedTruePuzzle(solvedPuzzle)
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(solvedPuzzle))
      const result2 = generateUnsolvedTruePuzzle(solvedPuzzle)
      expect(JSON.stringify(result2)).not.toEqual(JSON.stringify(solvedPuzzle))
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result2))
    })
  })
})