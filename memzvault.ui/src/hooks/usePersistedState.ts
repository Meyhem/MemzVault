import {
  atom,
  AtomOptions,
  RecoilState,
  useRecoilState,
  SetterOrUpdater,
} from 'recoil'

function safeJsonParse(str: any) {
  try {
    return JSON.parse(str)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeJsonParse', e)
    return null
  }
}

export function persistedAtom<T>(cfg: AtomOptions<T>) {
  return atom<T>({
    ...cfg,
    default: safeJsonParse(localStorage.getItem(cfg.key)) || cfg.default,
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
