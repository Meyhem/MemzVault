import { Route, Router, Switch } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { RecoilRoot } from 'recoil'
import './common/i18n'

import { theme, GlobalStyle } from './common/theme'
import { history } from './common/history'
import { LoginPage } from './views/login'
import { RepositoryPage } from './views/repository'

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/repository" exact component={RepositoryPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </RecoilRoot>
  )
}
