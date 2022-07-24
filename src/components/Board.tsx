import styled from "styled-components";

const BoardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const MediumRow = styled.div`
  display: flex;
`;
const MediumSquare = styled.div`
  border: 2px solid black;
`;

const Row = styled.div`
  display: flex;
`;

const SmallSquare = styled.div<{
  bold: boolean;
  highlighted: boolean;
  targeted: boolean;
  length: number;
  error: boolean;
}>`
  height: ${(props) => `${props.length}px`};
  width: ${(props) => `${props.length}px`};
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: ${(props) => (props.bold ? "bold" : "inherit")};
  &:hover {
    background-color: lightblue;
  }
  background-color: ${(props) =>
    props.error
      ? "pink"
      : props.targeted
      ? "rgba(247, 189, 0, 0.5)"
      : props.highlighted
      ? "lightblue"
      : "transparent"};
`;

const TinySquare = styled.div<{ highlighted: boolean; length: number }>`
  height: ${(props) => `${props.length}px`};
  width: ${(props) => `${props.length}px`};
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.highlighted ? "lightblue" : "transparent"};
`;

type Props = {
  solvingState: number[][];
  state: number[][];
  highlightedNumber?: number;
  targetSquare?: number[];
  invalidSquares?: number[][];
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
  let smallSquareLength =
    (Math.min(window.screen.availWidth, window.screen.availHeight) - 100) / 9;
  if (smallSquareLength > 60) {
    smallSquareLength = 60;
  }
  let tinySquareLength = smallSquareLength / 3;
  const getDisplayedValue = (rowIndex: number, colIndex: number) => {
    if (solvingState[rowIndex][colIndex] !== 0) {
      return solvingState[rowIndex][colIndex];
    }
    if (pencilState[rowIndex][colIndex].length > 0) {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {pencilState[rowIndex][colIndex].map((n) => (
            <TinySquare
              length={tinySquareLength}
              highlighted={highlightedNumber === n}
            >
              {n}
            </TinySquare>
          ))}
        </div>
      );
    }
    return "";
  };
  return (
    <BoardContainer>
      {Array.from(Array(3).keys()).map((a) => (
        <MediumRow>
          {Array.from(Array(3).keys()).map((b) => (
            <MediumSquare>
              {Array.from(Array(3).keys()).map((c) => (
                <Row>
                  {Array.from(Array(3).keys()).map((d) => {
                    const rowIndex = a * 3 + c;
                    const colIndex = b * 3 + d;
                    const isInvalid =
                      invalidSquares !== undefined &&
                      invalidSquares[rowIndex][colIndex] === 1;
                    const displayedValue = getDisplayedValue(
                      rowIndex,
                      colIndex
                    );
                    return (
                      <SmallSquare
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
