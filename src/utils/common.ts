export const applyMove = (puzzle: number[][], move: number[]) => {
  const [rowIndex, colIndex, n] = move
  puzzle[rowIndex][colIndex] = n
  return puzzle
}
