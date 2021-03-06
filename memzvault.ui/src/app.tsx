import { Route, Router, Switch } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { RecoilRoot } from 'recoil'

import { theme, GlobalStyle } from './common/theme'
import { history } from './common/history'
import { LoginPage } from './views/login'

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={LoginPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </RecoilRoot>
  )
}
