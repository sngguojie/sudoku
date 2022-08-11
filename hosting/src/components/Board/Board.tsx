
import BoardContainer from "./components/BoardContainer";
import MediumRow from "./components/MediumRow";
import MediumSquare from "./components/MediumSquare";
import Row from "./components/Row";
import TinySquare from "./components/TinySquare";
import SmallSquare, { BorderType } from "./components/SmallSquare";
import TinySquareContainer from "./components/TinySquareContainer";

type Props = {
  solvingState: number[][];
  state: number[][];
  highlightedNumber?: number;
  targetSquare?: number[];
  invalidSquares?: boolean[][];
  pencilState: number[][][];
  onClick: (rowIndex: number, colIndex: number) => void;
};

const Board = ({
  solvingState,
  state,
  highlightedNumber,
  targetSquare,
  invalidSquares,
  pencilState,
  onClick,
}: Props) => {
  let maxSmallSquareLength = 40
  let smallSquareLength =
    (Math.min(window.screen.availWidth, window.screen.availHeight) - 100) / 9;
  if (smallSquareLength > maxSmallSquareLength) {
    smallSquareLength = maxSmallSquareLength;
  }
  let tinySquareLength = smallSquareLength / 3;
  const getDisplayedValue = (rowIndex: number, colIndex: number) => {
    if (solvingState[rowIndex][colIndex] !== 0) {
      return solvingState[rowIndex][colIndex];
    }
    if (pencilState[rowIndex][colIndex].length > 0) {
      return (
        <TinySquareContainer>
          {pencilState[rowIndex][colIndex].map((n) => (
            <TinySquare
              key={n}
              length={tinySquareLength}
              highlighted={highlightedNumber === n}
            >
              {n}
            </TinySquare>
          ))}
        </TinySquareContainer>
      );
    }
    return "";
  };
  const getBorderType = (rowIndex: number, colIndex: number): BorderType => {
    const middleCol = colIndex % 3 === 1;
    const middleRow = rowIndex % 3 === 1;
    let borderType: BorderType = "none";
    if (middleRow && middleCol) {
      borderType = "full";
    } else if (middleRow) {
      borderType = "vertical";
    } else if (middleCol) {
      borderType = "horizontal";
    }
    return borderType
  }
  return (
    <BoardContainer>
      {Array.from(Array(3).keys()).map((a) => (
        <MediumRow key={a}>
          {Array.from(Array(3).keys()).map((b) => (
            <MediumSquare key={a * 3 + b}>
              {Array.from(Array(3).keys()).map((c) => (
                <Row key={(a * 3 + b) * 3 + c}>
                  {Array.from(Array(3).keys()).map((d) => {
                    const rowIndex = a * 3 + c;
                    const colIndex = b * 3 + d;
                    const isInvalid =
                      invalidSquares !== undefined &&
                      invalidSquares[rowIndex][colIndex] === true;
                    const displayedValue = getDisplayedValue(
                      rowIndex,
                      colIndex
                    );
                    return (
                      <SmallSquare
                        key={((a * 3 + b) * 3 + c) * 3 + d}
                        length={smallSquareLength}
                        bold={state[rowIndex][colIndex] !== 0}
                        highlighted={
                          highlightedNumber === solvingState[rowIndex][colIndex]
                        }
                        targeted={
                          targetSquare !== undefined &&
                          targetSquare[0] === rowIndex &&
                          targetSquare[1] === colIndex
                        }
                        error={isInvalid}
                        borderType={getBorderType(rowIndex, colIndex)}
                        onClick={() => onClick(rowIndex, colIndex)}
                      >
                        {displayedValue}
                      </SmallSquare>
                    );
                  })}
                </Row>
              ))}
            </MediumSquare>
          ))}
        </MediumRow>
      ))}
    </BoardContainer>
  );
};

export default Board;
