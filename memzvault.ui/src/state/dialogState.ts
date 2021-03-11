import { atom, DefaultValue, selector } from 'recoil'

type Dialogs = 'Upload'

export interface DialogState {
  open?: Dialogs
}

export const dialogState = atom<DialogState>({
  key: 'dialogState',
  default: { open: 'Upload' },
})

export const dialogVisibility = selector<Dialogs>({
  key: 'dialogVisibility',
  get: ({ get }) => get(dialogState).open,
  set: ({ set, get }, value) => {
    set(dialogState, {
      ...get(dialogState),
      open: value instanceof DefaultValue ? 'Upload' : value,
    })
  },
})
