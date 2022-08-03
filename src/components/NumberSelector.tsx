import styled from "styled-components";
import RoundButton from "./RoundButton";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
`;
const Row = styled.div`
  display: flex;
`;
type Props = {
  completedNumbers: number[];
  highlightedNumbers: number[];
  onSelect: (n: number) => void;
};

const NumberSelector = ({
  onSelect,
  completedNumbers,
  highlightedNumbers,
}: Props) => {
  return (
    <Container>
      {Array.from(Array(3).keys()).map((i) => {
        return (
          <Row key={i}>
            {Array.from(Array(3).keys()).map((j) => {
              let n = i * 3 + j + 1;
              let highlightColor = highlightedNumbers.includes(n)
                ? "rgba(120, 235, 133, 0.5)"
                : undefined;
              let disabled = completedNumbers.includes(n);
              return (
                <RoundButton
                  key={n}
                  disabled={disabled}
                  highlightColor={highlightColor}
                  onClick={() => onSelect(n)}
                >
                  {n}
                </RoundButton>
              );
            })}
          </Row>
        );
      })}
    </Container>
  );
};

export default NumberSelector;
