import { renderHook, act } from '@testing-library/react'
import { useDebounce, useLoadingState, useCopyToClipboard } from '../useCommon'

describe('Custom Hooks', () => {
  describe('useDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      expect(result.current).toBe('initial')

      rerender({ value: 'updated', delay: 500 })
      expect(result.current).toBe('initial')

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(result.current).toBe('updated')
    })
  })

  describe('useLoadingState', () => {
    it('should manage loading state', () => {
      const { result } = renderHook(() => useLoadingState())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)

      act(() => {
        result.current.startLoading()
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should handle errors', () => {
      const { result } = renderHook(() => useLoadingState())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error?.message).toBe('Test error')
    })
  })

  describe('useCopyToClipboard', () => {
    it('should track copy state', () => {
      const { result } = renderHook(() => useCopyToClipboard())

      expect(result.current.copied).toBe(false)
    })
  })
})
