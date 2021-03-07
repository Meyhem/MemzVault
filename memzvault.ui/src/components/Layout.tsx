import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { flexCenter } from '../common/mixins'

interface Props {
  centered?: boolean
}

const LayoutContainer = styled.div<Props>`
  width: 100%;
  ${({ centered }) => (centered ? flexCenter : '')}
`

export const Layout: FunctionComponent<Props> = ({ children, ...rest }) => {
  return <LayoutContainer {...rest}>{children}</LayoutContainer>
}
