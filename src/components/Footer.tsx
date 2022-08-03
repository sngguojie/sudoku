import styled from "styled-components";

const FooterDiv = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 540px;
`;

const FooterText = styled.span`
  font-family: "indie-flower";
  font-size: 0.8rem;
`;

export default function Footer() {
  return (
    <FooterDiv>
      <FooterText>Made by Melvyn Sng</FooterText>
    </FooterDiv>
  );
}
