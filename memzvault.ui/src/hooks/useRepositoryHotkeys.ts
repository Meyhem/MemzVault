import { useEffect } from 'react'

interface UseHotkeysOptions {
  onAdd(): void
  onEscape(): void
  onPrev(): void
  onNext(): void
}

export function useHotkeys({
  onAdd,
  onEscape,
  onPrev,
  onNext,
}: UseHotkeysOptions) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'NumpadAdd':
          onAdd()
          break
        case 'Escape':
          onEscape()
          break
        case 'KeyA':
          onPrev()
          break
        case 'KeyD':
          onNext()
          break
      }
    }

    document.addEventListener('keyup', handleKeyPress)
    return () => {
      document.removeEventListener('keyup', handleKeyPress)
    }
  }, [onAdd, onEscape, onNext, onPrev])
}
