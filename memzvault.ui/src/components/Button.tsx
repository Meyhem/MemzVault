import React, { FC } from 'react'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonProps {
  onClick?(): void
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const StyledButton = styled.button`
  border: none;
  padding: 0.8em;
  border-radius: 4px;
`

export const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>
}
