
export const applyMove = (puzzle: number[][], move: number[]) => {
  const [rowIndex, colIndex, n] = move
  puzzle[rowIndex][colIndex] = n
  return puzzle
}

export const stringifyPuzzle = (puzzle: number[][]) => {
  return puzzle.map((r) => r.map((n) => (n === 0 ? "." : n.toString())).join("")).join("")
}