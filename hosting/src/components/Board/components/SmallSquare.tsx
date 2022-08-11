import styled from "styled-components";

export type BorderType = "full" | "horizontal" | "vertical" | "none";

const SmallSquare = styled.div<{
  bold: boolean;
  highlighted: boolean;
  targeted: boolean;
  length: number;
  error: boolean;
  borderType: BorderType;
}>`
  height: ${(props) => `${props.length}px`};
  width: ${(props) => `${props.length}px`};
  border-top: ${(props) =>
    ["full", "vertical"].includes(props.borderType)
      ? "1px solid black"
      : "none"};
  border-bottom: ${(props) =>
    ["full", "vertical"].includes(props.borderType)
      ? "1px solid black"
      : "none"};
  border-left: ${(props) =>
    ["full", "horizontal"].includes(props.borderType)
      ? "1px solid black"
      : "none"};
  border-right: ${(props) =>
    ["full", "horizontal"].includes(props.borderType)
      ? "1px solid black"
      : "none"};
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: ${(props) => (props.bold ? "bold" : "inherit")};
  &:hover {
    background-color: rgba(247, 189, 0, 0.3);
  }
  background-color: ${(props) =>
    props.error
      ? "pink"
      : props.targeted
      ? "rgba(247, 189, 0, 0.7)"
      : props.highlighted
      ? "lightblue"
      : "transparent"};
`;

export default SmallSquare;
