import {
  CalculatorIcon,
  PencilIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  RefreshIcon,
  RewindIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { cloneDeep } from "lodash";
import { KeyboardEventHandler, useEffect, useCallback, useState } from "react";
import ReactConfetti from "react-confetti";
import styled from "styled-components";
import useLocalStorage from "../hooks/useLocalStorage";
import { stringifyPuzzle } from "../utils/common";
import { numbers } from "../utils/constants";
import {
  generateSolvedPuzzle,
  generateUnsolvedTruePuzzle,
} from "../utils/generator";
import { calculateValidMoves, getSolutions } from "../utils/solver";
import { getInvalidSquares } from "../utils/validator";
import Board from "./Board/Board";
import NumberSelector from "./NumberSelector";
import RoundButton from "./RoundButton";

type NumberSideType = "right" | "left";
const ControlsContainer = styled.div<{ numberSide: NumberSideType }>`
  margin-top: 20px;
  max-width: 540px;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.numberSide === "right" ? "row" : "row-reverse"};
  justify-content: space-around;
`;
const ControlsButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`;

const HeaderControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const initializePencilState = () => {
  return Array.from({ length: 9 }, () => {
    return Array.from({ length: 9 }, () => []);
  });
};

const fetchPuzzle = async () => {
  return new Promise<number[][]>((resolve) => {
    resolve(generateUnsolvedTruePuzzle(generateSolvedPuzzle()));
  });
};
export default function Game() {
  const cheatMode = window.location.pathname === "/cheat";
  const [state, setState] = useLocalStorage<number[][]>("state");
  const [solvingState, setSolvingState] =
    useLocalStorage<number[][]>("solvingState");
  const [pencilState, setPencilState] = useLocalStorage<number[][][]>(
    "pencilState",
    initializePencilState()
  );
  const [moves, setMoves] = useLocalStorage<number[][]>("moves", []);
  const [targetSquare, setTargetSquare] = useState<number[]>();
  const [highlightedNumber, setHighlightedNumber] = useState<number>();
  const [completedNumbers, setCompletedNumbers] = useState<number[]>([]);
  const [invalidSquares, setInvalidSquares] = useState<boolean[][]>();
  const [pencilMode, setPencilMode] = useState(false);
  const [throwConfetti, setThrowConfetti] = useState(false);
  const [fetchPuzzleLoading, setFetchPuzzleLoading] = useState(false);

  useEffect(() => {
    if (completedNumbers.length === 9) {
      setThrowConfetti(true);
      setTimeout(() => setThrowConfetti(false), 10000);
    }
  }, [completedNumbers]);
  const resetPencilState = useCallback(() => {
    let initializedPencilState = initializePencilState();
    setPencilState(initializedPencilState);
  }, [setPencilState]);

  const handlefetchPuzzle = useCallback(() => {
    setFetchPuzzleLoading(true);
    fetchPuzzle().then((puzzle) => {
      if (cheatMode) {
        console.log({
          puzzle: stringifyPuzzle(puzzle),
        });
      }
      setState(puzzle);
      setSolvingState(puzzle);
      setMoves([]);
      setFetchPuzzleLoading(false);
      fetchPuzzle();
      resetPencilState();
    });
  }, [setState, setSolvingState, setMoves, resetPencilState, cheatMode]);
  useEffect(() => {
    if (state === undefined) {
      handlefetchPuzzle();
    }
  }, [state, handlefetchPuzzle]);

  useEffect(() => {
    if (solvingState) {
      const newCompletedNumbers = numbers.filter((n) => {
        let count = 0;
        solvingState.forEach((row) => {
          row.forEach((value) => {
            if (value === n) count += 1;
          });
        });
        return count === 9;
      });
      setCompletedNumbers(newCompletedNumbers);
      const { isValid, invalidSquares: newInvalidSquares } =
        getInvalidSquares(solvingState);
      let shouldSetInvalidSquares = !isValid;
      if (isValid) {
        let solutions = getSolutions(solvingState);
        if (solutions.length !== 1) {
          shouldSetInvalidSquares = true;
          let [r, c] = moves[moves.length - 1];
          newInvalidSquares[r][c] = true;
        }
      }
      if (shouldSetInvalidSquares) {
        setInvalidSquares(newInvalidSquares);
      } else {
        setInvalidSquares(undefined);
      }
    }
  }, [solvingState, moves]);

  if (!state || !solvingState) {
    return null;
  }

  const updateSolvingState = (
    rowIndex: number,
    colIndex: number,
    value: number
  ) => {
    let newState = cloneDeep(solvingState);
    newState[rowIndex][colIndex] = value;
    setSolvingState(newState);
    setMoves([...moves, [rowIndex, colIndex, value]]);
  };
  const updatePencilState = (
    rowIndex: number,
    colIndex: number,
    value: number
  ) => {
    let newState = cloneDeep(pencilState);
    if (newState[rowIndex][colIndex].includes(value)) {
      newState[rowIndex][colIndex] = newState[rowIndex][colIndex].filter(
        (n) => n !== value
      );
    } else {
      newState[rowIndex][colIndex] = [
        ...newState[rowIndex][colIndex],
        value,
      ].sort();
    }
    setPencilState(newState);
  };

  const clearPencilState = (rowIndex: number, colIndex: number) => {
    let newState = cloneDeep(pencilState);
    newState[rowIndex][colIndex] = [];
    setPencilState(newState);
  };
  const handleClick = (rowIndex: number, colIndex: number) => {
    if (state[rowIndex][colIndex] === 0) {
      setTargetSquare([rowIndex, colIndex]);
    }
    if (solvingState[rowIndex][colIndex] !== 0) {
      setHighlightedNumber(solvingState[rowIndex][colIndex]);
    }
  };

  const handleNumberSelect = (n: number) => {
    if (
      targetSquare !== undefined &&
      state[targetSquare[0]][targetSquare[1]] === 0
    ) {
      if (!pencilMode) {
        updateSolvingState(targetSquare[0], targetSquare[1], n);
        if (n !== 0) {
          setHighlightedNumber(n);
        }
      } else {
        if (n !== 0) {
          updatePencilState(targetSquare[0], targetSquare[1], n);
        }
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (/^\d$/.test(event.key)) {
      handleNumberSelect(parseInt(event.key));
      return;
    }
    if (targetSquare) {
      let [targetRowIndex, targetColIndex] = targetSquare;
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        if (event.key === "ArrowUp" && targetRowIndex > 0) {
          setTargetSquare([targetRowIndex - 1, targetColIndex]);
          return;
        }
        if (event.key === "ArrowDown" && targetRowIndex < 8) {
          setTargetSquare([targetRowIndex + 1, targetColIndex]);
          return;
        }
        if (event.key === "ArrowLeft" && targetColIndex > 0) {
          setTargetSquare([targetRowIndex, targetColIndex - 1]);
          return;
        }
        if (event.key === "ArrowRight" && targetColIndex < 8) {
          setTargetSquare([targetRowIndex, targetColIndex + 1]);
          return;
        }
      }
      if (event.key === "Enter") {
        if (solvingState[targetRowIndex][targetColIndex] !== 0) {
          setHighlightedNumber(solvingState[targetRowIndex][targetColIndex]);
          return;
        }
      }
    }
    if (event.key === " ") {
      setPencilMode(!pencilMode);
    }
    if (event.key === "Backspace") {
      handleTrash();
    }
  };

  const handleReset = () => {
    setSolvingState(state);
    resetPencilState();
    setMoves([]);
  };

  const highlightedNumbers =
    targetSquare && pencilMode
      ? pencilState[targetSquare[0]][targetSquare[1]]
      : [];
  const handleTrash = () => {
    if (targetSquare && state[targetSquare[0]][targetSquare[1]] === 0) {
      let [rowIndex, colIndex] = targetSquare;
      if (solvingState[rowIndex][colIndex] !== 0) {
        handleNumberSelect(0);
      }
      if (pencilState[rowIndex][colIndex].length > 0) {
        clearPencilState(rowIndex, colIndex);
      }
    }
  };
  const togglePencilMode = () => setPencilMode(!pencilMode);
  const handleBack = () => {
    if (moves && moves.length > 0) {
      let newMoves = cloneDeep(moves);
      let [r, c] = newMoves.pop() as number[];
      updateSolvingState(r, c, 0);
      setMoves(newMoves);
    }
  };

  const handlePencilAll = () => {
    const { validMoves } = calculateValidMoves(solvingState);
    setPencilState(validMoves);
  };
  const handleHint = () => {
    let solutions = getSolutions(solvingState);
    const { countToSquares } = calculateValidMoves(solvingState);
    const [r, c] = [...countToSquares].flat()[0];
    if (solutions.length > 0) {
      let n: number = JSON.parse(solutions[0])[r][c];
      updateSolvingState(r, c, n);
      setTargetSquare([r, c]);
    }
  };
  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      {throwConfetti && <ReactConfetti numberOfPieces={1000} recycle={false} />}
      <HeaderControls>
        <RoundButton onClick={handlefetchPuzzle} disabled={fetchPuzzleLoading}>
          <PlusIcon style={{ height: "1.25rem", width: "1.25rem" }} />
        </RoundButton>
        <RoundButton onClick={handleReset}>
          <RefreshIcon style={{ height: "1.25rem", width: "1.25rem" }} />
        </RoundButton>
      </HeaderControls>
      <Board
        state={state}
        solvingState={solvingState}
        targetSquare={targetSquare}
        highlightedNumber={highlightedNumber}
        invalidSquares={invalidSquares}
        pencilState={pencilState}
        onClick={handleClick}
      />
      <ControlsContainer numberSide={"left"}>
        {cheatMode && (
          <ControlsButtonContainer>
            <RoundButton onClick={handlePencilAll}>
              <CalculatorIcon />
            </RoundButton>

            <RoundButton onClick={handleHint}>
              <QuestionMarkCircleIcon
                style={{ height: "1.25rem", width: "1.25rem" }}
              />
            </RoundButton>
          </ControlsButtonContainer>
        )}
        <ControlsButtonContainer>
          <RoundButton
            onClick={togglePencilMode}
            highlightColor={pencilMode ? "rgba(120, 235, 133, 0.5)" : undefined}
          >
            <PencilIcon style={{ height: "1.25rem", width: "1.25rem" }} />
          </RoundButton>
          <RoundButton onClick={handleTrash}>
            <TrashIcon style={{ height: "1.25rem", width: "1.25rem" }} />
          </RoundButton>
          <RoundButton onClick={handleBack}>
            <RewindIcon />
          </RoundButton>
        </ControlsButtonContainer>
        <NumberSelector
          onSelect={(n) => handleNumberSelect(n)}
          completedNumbers={completedNumbers}
          highlightedNumbers={highlightedNumbers}
        />
      </ControlsContainer>
    </div>
  );
}
