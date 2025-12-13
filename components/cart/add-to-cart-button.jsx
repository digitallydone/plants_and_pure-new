"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const maxQuantity = Math.min(product.stock, 10)

  async function handleAddToCart() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to add to cart")
      }

      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none"
          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button className="flex-1 gap-2" size="lg" onClick={handleAddToCart} disabled={isLoading || product.stock === 0}>
        <ShoppingCart className="h-5 w-5" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  )
}
