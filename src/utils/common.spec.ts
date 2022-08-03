import { applyMove } from "./common"

describe("common",() => {
  describe("applyMove", () => {
    test("updates original array with move", () => {
      const originalEmptyPuzzle = [
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
      let result = applyMove(originalEmptyPuzzle, [0,0,1])
      expect(result[0][0]).toEqual(1)
      for (let i = 0; i < 9; i++) {
        // check reference to array is the same
        expect(result[i] === originalEmptyPuzzle[i]).toEqual(true)
      }
    })
  })
})
