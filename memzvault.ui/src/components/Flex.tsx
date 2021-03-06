import {
  color,
  grid,
  flex,
  margin,
  padding,
  border,
  layout,
  ColorProps,
  GridProps,
  FlexProps,
  MarginProps,
  PaddingProps,
  BorderProps,
  LayoutProps,
} from 'styled-system'

import styled from 'styled-components'

export const Flex = styled.div<
  ColorProps &
    GridProps &
    FlexProps &
    MarginProps &
    PaddingProps &
    BorderProps &
    LayoutProps
>`
  ${color}
  ${grid}
  ${flex}
  ${margin}
  ${padding}
  ${border}
  ${layout}
`
