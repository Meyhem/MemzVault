import { atom, DefaultValue, selector } from 'recoil'

type Dialogs = 'Upload' | 'Detail'

export interface DialogState {
  open?: Dialogs
}

export const dialogState = atom<DialogState>({
  key: 'dialogState',
  default: { open: null },
})

export const dialogVisibility = selector<Dialogs>({
  key: 'dialogVisibility',
  get: ({ get }) => get(dialogState).open,
  set: ({ set, get }, value) => {
    set(dialogState, {
      ...get(dialogState),
      open: value instanceof DefaultValue ? null : value,
    })
  },
})
