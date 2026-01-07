import { formatCurrency, formatDate, formatBytes, formatRUT, formatPhone, countWords } from '../formatters'

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1.000')
      expect(formatCurrency(1500000)).toBe('$1.500.000')
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(500)).toBe('500 B')
      expect(formatBytes(2048)).toBe('2.0 KB')
      expect(formatBytes(5242880)).toBe('5.0 MB')
    })
  })

  describe('formatRUT', () => {
    it('should format RUT correctly', () => {
      expect(formatRUT('123456789')).toBe('12.345.678-9')
      expect(formatRUT('12345678K')).toBe('12.345.678-K')
    })
  })

  describe('formatPhone', () => {
    it('should format Chilean phone numbers', () => {
      expect(formatPhone('+56912345678')).toBe('+56 9 1234 5678')
    })
  })

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('hello world')).toBe(2)
      expect(countWords('one two three four five')).toBe(5)
      expect(countWords('  spaces   between   ')).toBe(2)
    })
  })
})
