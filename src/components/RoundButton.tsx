import styled from "styled-components";

const RoundButton = styled.button<{ highlightColor?: string }>`
  margin: 10px;
  font-size: 24px;
  height: 36px;
  width: 36px;
  border-radius: 100%;
  background-color: ${(props) => (props.disabled ? "grey" : (props.highlightColor || "transparent"))};
  cursor: pointer;
`;

export default RoundButton;
