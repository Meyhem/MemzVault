import _ from 'lodash'
import { Field, Form } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { history } from '../common/history'
import {
  BorderedBox,
  FormControl,
  Input,
  Layout,
  Button,
  Flex,
} from '../components'
import { useApi, MemzResponse } from '../hooks/useApi'
import { useNotifications } from '../hooks/useNotifications'
import { usePersistedState } from '../hooks/usePersistedState'
import { tokenState } from '../state/tokenState'

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`

const SubmitButton = styled(Button)`
  margin-left: 16px;
`

export const LoginPage = () => {
  const [, setToken] = usePersistedState(tokenState)
  const { t } = useTranslation()
  const { notifyHttp } = useNotifications()

  const { post, request, response, loading } = useApi<MemzResponse<string>>({
    path: '/api/auth/token',
    method: 'POST',
  })

  return (
    <Layout centered={true}>
      <BorderedBox padding={3}>
        <Form
          initialValues={{ repository: 'repo1', passphrase: 'keks' }}
          onSubmit={async ({ repository, passphrase }) => {
            await post({ repository, passphrase })

            notifyHttp(request, response, 'Logged in')

            if (response.status === 200) {
              setToken(response.data.data)
              _.defer(() => history.push('/repository'))
            }
          }}
        >
          {({ handleSubmit, submitting }) => (
            <StyledForm onSubmit={handleSubmit} autoComplete="on">
              <Field
                name="repository"
                render={(field) => (
                  <FormControl
                    additionalProps={{
                      autoComplete: 'username',
                    }}
                    label="Repository"
                    component={Input}
                    input={field.input}
                    meta={field.meta}
                  />
                )}
              />

              <Field
                name="passphrase"
                render={(field) => (
                  <FormControl
                    additionalProps={{
                      autoComplete: 'password',
                    }}
                    label="Passphrase"
                    component={Input}
                    htmlType="password"
                    input={field.input}
                    meta={field.meta}
                  />
                )}
              />

              <Flex justifyContent="right" alignItems="center">
                {response?.data?.error?.errorCode && (
                  <span>
                    {t(`memzErrorCode:${response.data.error.errorCode}`)}
                  </span>
                )}
                <SubmitButton type="submit" disabled={submitting}>
                  Go {loading && '<>'}
                </SubmitButton>
              </Flex>
            </StyledForm>
          )}
        </Form>
      </BorderedBox>
    </Layout>
  )
}
