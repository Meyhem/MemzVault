import { createGlobalStyle } from 'styled-components'

export const theme = {
  colors: {
    primary: 'blue',
    text1: '#DBFFFF',
    text2: '#6060ff',

    border1: '#DBFFFF',

    bg1: '#1e1e1e',
    bg2: '#252526',
  },
  fontSizes: ['14px', '16px', '20px', '24px'],
  space: [0, '8px', '16px', '24px', '32px', '40px'],
}

export type Theme = typeof theme

export const GlobalStyle = createGlobalStyle`
  body, html, #root {
    display: flex;
    background: ${({ theme }) => theme.colors.bg1};
    color: ${({ theme }) => theme.colors.text1};
    font-family: 'Source Code Pro', monospace;
    font-size: ${({ theme }) => theme.fontSizes[1]};
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.text2};
  }

  input, button {
    font-family: 'Source Code Pro', monospace;
  }
`
