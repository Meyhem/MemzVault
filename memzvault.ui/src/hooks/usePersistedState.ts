import {
  atom,
  AtomOptions,
  RecoilState,
  useRecoilState,
  SetterOrUpdater,
} from 'recoil'

export function persistedAtom<T>(cfg: AtomOptions<T>) {
  return atom<T>({
    ...cfg,
    default: JSON.parse(localStorage.getItem(cfg.key)) || cfg.default,
  })
}

export function usePersistedState<T>(
  recoilState: RecoilState<T>
): [T, SetterOrUpdater<T>] {
  const [state, setState] = useRecoilState(recoilState)

  return [
    state,
    (v: T) => {
      setState(v)
      localStorage.setItem(recoilState.key, JSON.stringify(v))
    },
  ]
}
