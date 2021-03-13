import _ from 'lodash'

export function isImage(item: MetaItem) {
  return _.startsWith(item.mimeType, 'image')
}

export function stopPropagation(e: Event) {
  e.stopPropagation()
}
