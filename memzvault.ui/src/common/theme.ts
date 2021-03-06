import { createGlobalStyle } from 'styled-components'

export const theme = {
  colors: {
    primary: 'blue',
    text1: '#DBFFFF',
    text2: '#6060ff',

    bg1: '#1e1e1e',
    bg2: '#252526',
  },
  fontSizes: [14, 16, 20, 24],
}

export type Theme = typeof theme

export const GlobalStyle = createGlobalStyle`
  body, html {
    
    display: flex;
    background: ${({ theme }) => theme.colors.bg1};
    color: ${({ theme }) => theme.colors.text1};
    font-family: 'Source Code Pro', monospace;
    font-size: ${({ theme }) => theme.fontSizes[1]}px;
  }

  a {
    color: ${({ theme }) => theme.colors.text2};
  }
`
