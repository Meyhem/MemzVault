import _ from 'lodash'

export function isImage(item: MetaItem) {
  return _.startsWith(item.mimeType, 'image')
}

export function isVideo(item: MetaItem) {
  return _.startsWith(item.mimeType, 'video')
}

export function stopPropagation(e: Event) {
  e.stopPropagation()
}
