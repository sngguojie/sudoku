import styled from "styled-components";

const TinySquare = styled.div<{ highlighted: boolean; length: number }>`
height: ${(props) => `${props.length}px`};
width: ${(props) => `${props.length}px`};
font-size: 0.7rem;
display: flex;
justify-self: flex-start;
justify-content: center;
align-items: center;
background-color: ${(props) =>
  props.highlighted ? "lightblue" : "transparent"};
`;

export default TinySquare