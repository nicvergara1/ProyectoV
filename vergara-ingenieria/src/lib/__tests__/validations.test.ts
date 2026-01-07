import { validateRUT, contactSchema, invoiceSchema, productSchema } from '../validations'

describe('Validations', () => {
  describe('validateRUT', () => {
    it('should validate correct RUTs', () => {
      expect(validateRUT('11.111.111-1')).toBe(true)
      expect(validateRUT('12.345.678-5')).toBe(true)
    })

    it('should reject invalid RUTs', () => {
      expect(validateRUT('11.111.111-9')).toBe(false)
      expect(validateRUT('invalid')).toBe(false)
    })
  })

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        subject: 'Consulta',
        message: 'Este es un mensaje de prueba con más de veinte palabras para cumplir con el requisito mínimo de palabras que necesita el formulario de contacto'
      }
      expect(() => contactSchema.parse(validData)).not.toThrow()
    })

    it('should reject short messages', () => {
      const invalidData = {
        name: 'Juan',
        email: 'juan@example.com',
        subject: 'Test',
        message: 'Mensaje corto'
      }
      expect(() => contactSchema.parse(invalidData)).toThrow()
    })
  })

  describe('invoiceSchema', () => {
    it('should validate correct invoice data', () => {
      const validData = {
        tipo: 'compra' as const,
        numero_factura: 12345,
        fecha_emision: '2024-01-01',
        entidad: 'Empresa Test',
        monto_neto: 1000,
        iva: 190,
        estado: 'pendiente' as const
      }
      expect(() => invoiceSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid invoice numbers', () => {
      const invalidData = {
        tipo: 'compra' as const,
        numero_factura: 1234567, // más de 6 dígitos
        fecha_emision: '2024-01-01',
        entidad: 'Test',
        monto_neto: 1000,
        iva: 190,
        estado: 'pendiente' as const
      }
      expect(() => invoiceSchema.parse(invalidData)).toThrow()
    })
  })
})
