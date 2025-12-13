"use client"

import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR("/api/cart", fetcher)

  const addItem = async (productId, quantity = 1, variant) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, variant }),
    })
    mutate()
  }

  const updateQuantity = async (itemId, quantity) => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    })
    mutate()
  }

  const removeItem = async (itemId) => {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" })
    mutate()
  }

  const clearCart = async () => {
    await fetch("/api/cart", { method: "DELETE" })
    mutate()
  }

  return {
    items: data?.items || [],
    subtotal: data?.subtotal || 0,
    itemCount: data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    mutate,
  }
}
