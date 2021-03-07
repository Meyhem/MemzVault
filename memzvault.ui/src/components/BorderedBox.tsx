import { FunctionComponent } from 'react'
import styled from 'styled-components'

import { Flex, FlexProps } from './Flex'

const BorderedBoxContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.border1};
  border-radius: 4px;
`

export const BorderedBox: FunctionComponent<FlexProps> = ({
  children,
  ...rest
}) => {
  return <BorderedBoxContainer {...rest}>{children}</BorderedBoxContainer>
}
