import { Route, Router, Switch } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { RecoilRoot } from 'recoil'
import './common/i18n'

import { theme, GlobalStyle } from './common/theme'
import { history } from './common/history'
import { LoginPage } from './views/login'
import { RepositoryPage } from './views/repository'
import { ToastProvider } from 'react-toast-notifications'

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
          <GlobalStyle />
          <Router history={history}>
            <Switch>
              <Route path="/" exact component={LoginPage} />
              <Route path="/repository" exact component={RepositoryPage} />
            </Switch>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </RecoilRoot>
  )
}
