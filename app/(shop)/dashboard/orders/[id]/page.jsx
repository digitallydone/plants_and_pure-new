import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

async function getOrder(orderId, userId) {
  await dbConnect()
  const order = await Order.findOne({ _id: orderId, user: userId }).lean()
  return order
}

export default async function OrderDetailPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const order = await getOrder(id, session.user.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Order {order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUSES[order.orderStatus]?.color}>{ORDER_STATUSES[order.orderStatus]?.label}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-16 w-16 rounded-md bg-secondary/50 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg?height=64&width=64&query=plant"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                    <p className="text-sm">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.shippingAddress.street}</p>
            <p className="text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p className="text-sm">
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shippingCost === 0 ? "FREE" : formatCurrency(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-primary">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="pt-2">
              <Badge className={PAYMENT_STATUSES[order.paymentStatus]?.color}>
                {PAYMENT_STATUSES[order.paymentStatus]?.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
