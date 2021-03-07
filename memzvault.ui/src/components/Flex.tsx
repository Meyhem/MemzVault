import {
  color,
  grid,
  flexbox,
  margin,
  padding,
  border,
  layout,
  TypographyProps,
  FlexboxProps,
  MarginProps,
  PaddingProps,
  BorderProps,
  LayoutProps,
} from 'styled-system'

import styled from 'styled-components'
import { FunctionComponent } from 'react'

export type FlexProps = TypographyProps &
  FlexboxProps &
  MarginProps &
  PaddingProps &
  BorderProps &
  LayoutProps

export const Flex: FunctionComponent<FlexProps> = styled.div<FlexProps>`
  ${color}
  ${grid}
  ${flexbox}
  ${margin}
  ${padding}
  ${border}
  ${layout}
  display: flex;
`
