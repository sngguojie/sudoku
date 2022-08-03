import { solvedPuzzle } from "./constants"
import { getInvalidSquares } from "./validator"

describe("validator",() => {

  describe("getInvalidSquares", () => {
    test("for a valid puzzle", () => {
      let { invalidSquares, isValid } = getInvalidSquares(solvedPuzzle)
      expect(isValid).toEqual(true)
      invalidSquares.forEach(row => {
        row.forEach(squareNotValid => {
          expect(squareNotValid).toEqual(false)
        })
      })
    })
    test("for a invalid puzzle", () => {
      const firstRowInvalidPuzzle = [
        [1,1,2,2,3,3,4,4,1],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]
      let { invalidSquares, isValid } = getInvalidSquares(firstRowInvalidPuzzle)
      expect(isValid).toEqual(false)
      invalidSquares[0].forEach(squareNotValid => {
        expect(squareNotValid).toEqual(true)
      })
      for (let i = 1; i < 9; i++) {
        invalidSquares[i].forEach(squareNotValid => {
          expect(squareNotValid).toEqual(false)
        })
      }
    })
  })
})
