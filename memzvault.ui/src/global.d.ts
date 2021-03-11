import 'styled-components'
import { Theme } from './common/theme'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

declare global {
  export type Dictionary<T> = Record<string, T>

  export interface MetaItem {
    itemId: string
    originalFileName: string
    mimeType: string
    name: string
    tags: string[]
  }
}
