import 'styled-components'
import { Theme } from './common/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

declare global {
  export type Dictionary<T> = Record<string, T>
}
