import React, { KeyboardEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import Board from "./components/Board";
import NumberSelector from "./components/NumberSelector";
import RoundButton from "./components/RoundButton";
import { getInvalidSquares } from "./utils/validator";

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function App() {
  function getLocalStorage<T>(key: string): undefined | T {
    const data = localStorage.getItem(key);
    return data === null ? undefined : JSON.parse(data);
  }
  function updateLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  const [state, setState] = useState<number[][]>();
  const [solvingState, setSolvingState] = useState<number[][]>();
  const initializePencilState = () => {
    return Array.from({ length: 9 }, () => {
      return Array.from({ length: 9 }, () => []);
    });
  };
  const [pencilState, setPencilState] = useState<number[][][]>(
    initializePencilState()
  );
  const [targetSquare, setTargetSquare] = useState<number[]>();
  const [highlightedNumber, setHighlightedNumber] = useState<number>();
  const [completedNumbers, setCompletedNumbers] = useState<number[]>([]);
  const [invalidSquares, setInvalidSquares] = useState<number[][]>();
  const [pencilMode, setPencilMode] = useState(false);

  const fetchPuzzle = (callback: (data: number[][]) => void) => {
    fetch("https://sugoku.herokuapp.com/board?difficulty=easy")
      .then((response) => response.json())
      .then((data) => {
        callback(data.board);
      });
  };

  useEffect(() => {
    let localState = getLocalStorage<number[][]>("state");
    if (localState !== undefined) {
      setState(localState);
      let localSolvingState = getLocalStorage<number[][]>("solvingState");
      if (localSolvingState !== undefined) {
        setSolvingState(localSolvingState);
      } else {
        setSolvingState(localState);
      }
      let localPencilState = getLocalStorage<number[][][]>("pencilState");
      if (localPencilState !== undefined) {
        setPencilState(localPencilState);
      }
    } else {
      fetchPuzzle((data) => {
        setState(data);
        updateLocalStorage("state", data);
        setSolvingState(data);
        updateLocalStorage("solvingState", data);
      });
    }
  }, []);

  useEffect(() => {
    if (solvingState) {
      const numbers = Array.from(Array(9)).map((_, i) => i + 1);
      setCompletedNumbers(
        numbers.filter((n) => {
          let count = 0;
          solvingState.forEach((row) => {
            row.forEach((value) => {
              if (value === n) count += 1;
            });
          });
          return count === 9;
        })
      );
      const { isValid, invalidSquares: newInvalidSquares } =
        getInvalidSquares(solvingState);
      if (!isValid) {
        setInvalidSquares(newInvalidSquares);
      } else {
        setInvalidSquares(undefined);
      }
    }
  }, [solvingState]);

  if (!state || !solvingState) {
    return null;
  }

  const updateSolvingState = (
    rowIndex: number,
    colIndex: number,
    value: number
  ) => {
    let newState = solvingState.map((row) => [...row]);
    newState[rowIndex][colIndex] = value;
    setSolvingState(newState);
    updateLocalStorage("solvingState", newState);
  };
  const updatePencilState = (
    rowIndex: number,
    colIndex: number,
    value: number
  ) => {
    let newState = pencilState.map((row) =>
      row.map((writings) => [...writings])
    );
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
    updateLocalStorage("pencilState", newState);
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
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) &&
      targetSquare
    ) {
      if (event.key === "ArrowUp" && targetSquare[0] > 0) {
        setTargetSquare([targetSquare[0] - 1, targetSquare[1]]);
        return;
      }
      if (event.key === "ArrowDown" && targetSquare[0] < 8) {
        setTargetSquare([targetSquare[0] + 1, targetSquare[1]]);
        return;
      }
      if (event.key === "ArrowLeft" && targetSquare[1] > 0) {
        setTargetSquare([targetSquare[0], targetSquare[1] - 1]);
        return;
      }
      if (event.key === "ArrowRight" && targetSquare[1] < 8) {
        setTargetSquare([targetSquare[0], targetSquare[1] + 1]);
        return;
      }
    }
    if (event.key === "Enter" && targetSquare) {
      if (solvingState[targetSquare[0]][targetSquare[1]] !== 0) {
        setHighlightedNumber(solvingState[targetSquare[0]][targetSquare[1]]);
        return;
      }
    }
    if (event.key === " ") {
      setPencilMode(!pencilMode);
    }
  };

  const resetPencilState = () => {
    let initializedPencilState = initializePencilState();
    setPencilState(initializedPencilState);
    updateLocalStorage("pencilState", initializedPencilState);
  };
  const handlefetchPuzzle = () => {
    fetchPuzzle((data) => {
      setState(data);
      updateLocalStorage("state", data);
      setSolvingState(data);
      updateLocalStorage("solvingState", data);
    });
    resetPencilState();
  };
  const handleReset = () => {
    setSolvingState(state);
    updateLocalStorage("solvingState", state);
    resetPencilState();
  };

  return (
    <Container onKeyDown={handleKeyDown} tabIndex={0}>
      <div style={{ marginBottom: "20px" }}>
        <RoundButton onClick={handlefetchPuzzle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </RoundButton>
        <RoundButton onClick={handleReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </RoundButton>
      </div>
      {state && solvingState && (
        <Board
          state={state}
          solvingState={solvingState}
          targetSquare={targetSquare}
          highlightedNumber={highlightedNumber}
          invalidSquares={invalidSquares}
          pencilState={pencilState}
          onClick={(rowIndex, colIndex) => handleClick(rowIndex, colIndex)}
        />
      )}
      <NumberSelector
        onSelect={(n) => handleNumberSelect(n)}
        completedNumbers={completedNumbers}
      />
      <div style={{ marginTop: "50px" }}>
        <RoundButton onClick={() => handleNumberSelect(0)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </RoundButton>
        <RoundButton
          onClick={() => setPencilMode(!pencilMode)}
          highlightColor={pencilMode ? "lightgreen" : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </RoundButton>
      </div>
    </Container>
  );
}

export default App;
