import styled from "styled-components";
import RoundButton from "./RoundButton";

const Container = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
type Props = {
  completedNumbers: number[];
  onSelect: (n: number) => void;
};

const NumberSelector = ({ onSelect, completedNumbers }: Props) => {
  return (
    <Container>
      {Array.from(Array(9).keys()).map((i) => {
        let n = i + 1;
        return (
          <RoundButton
            disabled={completedNumbers.includes(n)}
            onClick={() => onSelect(n)}
          >
            {n}
          </RoundButton>
        );
      })}
    </Container>
  );
};

export default NumberSelector;
