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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`

const SubmitButton = styled(Button)`
  margin-left: 16px;
`

export const CreatePage = () => {
  const { t } = useTranslation()
  const { notifyHttp } = useNotifications()

  const { post, request, response, loading } = useApi<MemzResponse<string>>({
    path: '/api/repository',
    method: 'POST',
  })

  return (
    <Layout centered={true}>
      <BorderedBox padding={3}>
        <Form
          onSubmit={async ({ repository, passphrase, adminKey }) => {
            await post({ repository, passphrase, adminKey })

            notifyHttp(request, response, 'Repository created')

            if (response.status === 201) {
              history.push('/repository')
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
                      autoComplete: 'new-password',
                    }}
                    label="Passphrase"
                    component={Input}
                    htmlType="password"
                    input={field.input}
                    meta={field.meta}
                  />
                )}
              />

              <Field
                name="adminKey"
                render={(field) => (
                  <FormControl
                    additionalProps={{
                      autoComplete: 'off',
                    }}
                    label="Admin key"
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
                  Create repo {loading && '<>'}
                </SubmitButton>
              </Flex>
            </StyledForm>
          )}
        </Form>
      </BorderedBox>
    </Layout>
  )
}
