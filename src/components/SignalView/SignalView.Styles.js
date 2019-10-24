import { default as styled } from 'react-emotion';

export const SignalViewComponentStyles = styled('div')`
  h1 {
     font-size: 36px;
     padding: 10px;
     margin-bottom: 20px;
  }

  padding: 30px;
  margin: 0px;
  width: 75%;
  height: 75%;

  thead tr > th {
    font-size: 18px;
  }

  tbody > tr > td {
    word-wrap: break-word;
    max-width: 250px;
    font-size: 18px;
  }
`;
