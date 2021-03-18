import { Route, Router, Switch } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from 'react-toast-notifications'
import { useRecoilValue } from 'recoil'

import './common/i18n'
import { defaultTheme, GlobalStyle } from './common/theme'
import { history } from './common/history'
import { LoginPage } from './views/login'
import { RepositoryPage } from './views/repository'
import { CreatePage } from './views/create'
import { ResetPage } from './views/reset'
import { usePersistedState } from './hooks/usePersistedState'
import { settingsState } from './state/repositorySettings'
import { getRepositoryName } from './state/tokenState'

export function App() {
  const [settings] = usePersistedState(settingsState)
  const repoName = useRecoilValue(getRepositoryName)
  const savedFont = settings[repoName]?.font || 'Source Code Pro'

  const theme = {
    ...defaultTheme,
    font: savedFont,
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider autoDismiss={true} autoDismissTimeout={1500}>
        <GlobalStyle theme={theme} />
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/repository" exact component={RepositoryPage} />
            <Route path="/create" exact component={CreatePage} />
            <Route path="/reset" exact component={ResetPage} />
          </Switch>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}
