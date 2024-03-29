import { createGlobalStyle } from 'styled-components'

export const defaultTheme = {
  colors: {
    primary: 'blue',
    text1: '#DBFFFF',
    text2: '#6060ff',

    border1: '#DBFFFF',
    border2: '#868686',

    bg1: '#1e1e1e',
    bg2: '#252526',
    bg3: '#323232',
  },
  fontSizes: ['14px', '16px', '20px', '24px'],
  space: [0, '8px', '16px', '24px', '32px', '40px'],
  font: 'Source Code Pro',
}

export type Theme = typeof defaultTheme

export const GlobalStyle = createGlobalStyle`
  body, html, #root {
    display: flex;
    background: ${({ theme }) => theme.colors.bg1};
    color: ${({ theme }) => theme.colors.text1};
    font-family: ${({ theme }) => theme.font}, monospace;
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
    font-family: ${({ theme }) => theme.font}, monospace;
  }
`
