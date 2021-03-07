import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { LocalizedMessage } from '../common/validators'
import { Flex } from './Flex'

export interface FormControlProps<T> extends FieldRenderProps<T> {
  component: React.ComponentType<{ error?: any; type: string } & T>
  hideValidationMessage?: boolean
  label?: string
  htmlType?: string
  additionalProps?: T
}

const StyledFormControl = styled(Flex)<FormControlProps<unknown>>`
  width: 100%;
  margin-bottom: 16px;
  flex-direction: column;
`

const Error = styled.div`
  font-weight: bold;
`

export const FormError: FunctionComponent<{
  localizedMessage?: LocalizedMessage
  label?: string
}> = ({ localizedMessage, label }) => {
  const { t } = useTranslation('validation')
  const { translationKey, defaultMessage, interpolation } =
    localizedMessage || {}

  return (
    <Error>
      {t(`${translationKey}`, {
        defaultValue: defaultMessage,
        label,
        ...interpolation,
      })}
    </Error>
  )
}

export const FormControl = <A extends unknown = any>({
  label,
  component,
  hideValidationMessage,
  input,
  meta,
  htmlType = '',
  additionalProps,
  ...props
}: FormControlProps<A>) => {
  const Component = component

  const trimmedLabel = _.trimEnd(label)
  const metaErr = meta.error || meta.submitError
  return (
    <StyledFormControl {...props}>
      <span>{label}</span>
      <Component
        {...input}
        error={meta.touched && metaErr}
        {...props}
        type={htmlType}
        {...additionalProps}
      />
      {meta.touched && metaErr && !hideValidationMessage && (
        <FormError
          localizedMessage={metaErr}
          label={
            _.endsWith(trimmedLabel, '*')
              ? trimmedLabel.slice(0, -1)
              : trimmedLabel
          }
        />
      )}
    </StyledFormControl>
  )
}
