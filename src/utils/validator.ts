
const getRepeatedIndexes = (array: number[]) => {
  let numberIndexes: { [key: number]: number[] } = {}
  let keys: number[] = []
  array.forEach((n, i) => {
    if (n !== 0) {
      if (numberIndexes[n] === undefined) {
        numberIndexes[n] = [i]
        keys.push(n)
      } else {
        numberIndexes[n].push(i)
      }
    }
  })
  let result: number[] = []
  keys.forEach(key => {
    if (numberIndexes[key].length > 1) {
      result = [...result, ...numberIndexes[key]]
    }
  })
  return result
}

export const getInvalidSquares = (state: number[][]) => {
  let invalidSquares: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0))
  let isValid = true
  // check rows
  state.forEach((row, rowIndex) => {
    let repeatedIndexes = getRepeatedIndexes(row)
    isValid = isValid && repeatedIndexes.length === 0
    repeatedIndexes.forEach(repeatedIndex => {
      invalidSquares[rowIndex][repeatedIndex] = 1
    })
  })
  // check columns
  for (let colIndex = 0; colIndex < 9; colIndex ++) {
    let column = state.map(row => row[colIndex])
    let repeatedIndexes = getRepeatedIndexes(column)
    isValid = isValid && repeatedIndexes.length === 0
    repeatedIndexes.forEach(repeatedIndex => {
      invalidSquares[repeatedIndex][colIndex] = 1
    })
  }
  // check squares
  for (let a = 0; a < 3; a ++) {
    for (let b = 0; b < 3; b ++) {
      let squareNumbers = []
      for (let c = 0; c < 3; c ++) {
        for (let d = 0; d < 3; d ++) {
          let rowIndex = a*3+c
          let colIndex = b*3+d
          squareNumbers.push(state[rowIndex][colIndex])
        }
      }
      let repeatedIndexes = getRepeatedIndexes(squareNumbers)
      isValid = isValid && repeatedIndexes.length === 0
      repeatedIndexes.forEach(repeatedIndex => {
        let squareRow = Math.floor(repeatedIndex / 3)
        let squareCol = repeatedIndex % 3
        invalidSquares[a*3+squareRow][b*3+squareCol] = 1
      })
    }
  }
  return { invalidSquares, isValid }
} 