"use client"

import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/format"

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.product

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary/30">
        <img
          src={product.images?.[0] || "/placeholder.svg?height=80&width=80&query=plant"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link href={`/products/${product.slug}`} className="font-medium hover:text-primary">
              {product.name}
            </Link>
            {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
          </div>
          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => onRemove(item._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
