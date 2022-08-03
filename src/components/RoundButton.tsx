import styled from "styled-components";

const RoundButton = styled.button<{ highlightColor?: string }>`
  margin: 10px;
  font-size: 24px;
  height: 36px;
  width: 36px;
  border-radius: 100%;
  border: 2px solid black;
  background-color: ${(props) =>
    props.disabled ? "grey" : props.highlightColor || "transparent"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default RoundButton;
