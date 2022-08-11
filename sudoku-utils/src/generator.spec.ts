import { generateSolvedPuzzle, generateUnsolvedTruePuzzle } from './generator'
import { getSolutions, isSolved } from './solver'

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
      const generatedSolvedPuzzle = generateSolvedPuzzle()
      const result = generateUnsolvedTruePuzzle(generatedSolvedPuzzle)
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(generatedSolvedPuzzle))
      let solutions = getSolutions(result)
      expect(solutions.length).toEqual(1)
      const result2 = generateUnsolvedTruePuzzle(generatedSolvedPuzzle)
      let solutions2 = getSolutions(result2)
      expect(solutions2.length).toEqual(1)
      expect(JSON.stringify(result2)).not.toEqual(JSON.stringify(generatedSolvedPuzzle))
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result2))
    })
  })
})