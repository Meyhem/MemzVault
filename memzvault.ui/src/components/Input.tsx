import { ChangeEventHandler, FunctionComponent } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  border-radius: 4px;
  border: none;
  padding: 0.8em;
`

interface Props {
  value?: string
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Input: FunctionComponent<Props> = ({ children, ...rest }) => {
  return <StyledInput {...rest} />
}
