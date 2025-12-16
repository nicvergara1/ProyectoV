'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Product } from '@/types'

export async function getProduct(id: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return { product: null, error: error.message }
  }

  return { product: data as Product }
}

export async function getProducts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], error: error.message }
  }

  return { products: data as Product[] }
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const quantity = Number(formData.get('cantidad'))

  const rawData = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    cantidad: quantity,
    precio_unitario: Number(formData.get('precio_unitario')),
    categoria: formData.get('categoria'),
    stock_minimo: Number(formData.get('stock_minimo'))
  }

  const { data: product, error } = await supabase
    .from('productos')
    .insert(rawData)
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }

  // Register initial inventory movement
  if (quantity > 0) {
    const { error: movementError } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: product.id,
        tipo: 'entrada',
        cantidad: quantity,
        motivo: 'Inventario Inicial'
      })

    if (movementError) {
      console.error('Error creating initial movement:', movementError)
    }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function updateProductStock(id: number, newQuantity: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('productos')
    .update({ cantidad: newQuantity })
    .eq('id', id)

  if (error) {
    console.error('Error updating stock:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio_unitario: Number(formData.get('precio_unitario')),
    categoria: formData.get('categoria'),
    stock_minimo: Number(formData.get('stock_minimo'))
  }

  const { error } = await supabase
    .from('productos')
    .update(rawData)
    .eq('id', id)

  if (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function deleteProduct(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function registerProductExit(formData: FormData) {
  const supabase = await createClient()
  
  const productId = Number(formData.get('product_id'))
  const quantity = Number(formData.get('cantidad'))
  const reason = formData.get('motivo')
  const projectId = formData.get('project_id') ? Number(formData.get('project_id')) : null

  // 1. Get current stock
  const { data: product, error: fetchError } = await supabase
    .from('productos')
    .select('cantidad')
    .eq('id', productId)
    .single()

  if (fetchError || !product) {
    return { success: false, error: 'Producto no encontrado' }
  }

  if (product.cantidad < quantity) {
    return { success: false, error: 'Stock insuficiente' }
  }

  // 2. Create movement record
  const { error: movementError } = await supabase
    .from('movimientos_inventario')
    .insert({
      producto_id: productId,
      tipo: 'salida',
      cantidad: quantity,
      motivo: reason,
      proyecto_id: projectId
    })

  if (movementError) {
    return { success: false, error: movementError.message }
  }

  // 3. Update product stock
  const { error: updateError } = await supabase
    .from('productos')
    .update({ cantidad: product.cantidad - quantity })
    .eq('id', productId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function registerProductEntry(formData: FormData) {
  const supabase = await createClient()
  
  const productId = Number(formData.get('product_id'))
  const quantity = Number(formData.get('cantidad'))
  const reason = formData.get('motivo')

  // 1. Get current stock
  const { data: product, error: fetchError } = await supabase
    .from('productos')
    .select('cantidad')
    .eq('id', productId)
    .single()

  if (fetchError || !product) {
    return { success: false, error: 'Producto no encontrado' }
  }

  // 2. Create movement record
  const { error: movementError } = await supabase
    .from('movimientos_inventario')
    .insert({
      producto_id: productId,
      tipo: 'entrada',
      cantidad: quantity,
      motivo: reason
    })

  if (movementError) {
    return { success: false, error: movementError.message }
  }

  // 3. Update product stock
  const { error: updateError } = await supabase
    .from('productos')
    .update({ cantidad: product.cantidad + quantity })
    .eq('id', productId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function getInventoryMovements() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('movimientos_inventario')
    .select(`
      *,
      producto:productos(nombre, categoria),
      proyecto:proyectos(nombre)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching movements:', error)
    return { movements: [], error: error.message }
  }

  return { movements: data }
}
