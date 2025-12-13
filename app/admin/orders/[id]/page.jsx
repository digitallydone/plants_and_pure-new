import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants"
import { OrderStatusUpdate } from "@/components/admin/order-status-update"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

async function getOrder(id) {
  await dbConnect()
  const order = await Order.findById(id).populate("user", "name email").lean()
  return order
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUSES[order.orderStatus]?.color}>{ORDER_STATUSES[order.orderStatus]?.label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-border pb-4">
                  <div className="h-16 w-16 rounded-md bg-secondary overflow-hidden">
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
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "FREE" : formatCurrency(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user?.name || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">{order.user?.email}</p>
            </CardContent>
          </Card>

          {/* Shipping */}
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

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={PAYMENT_STATUSES[order.paymentStatus]?.color}>
                {PAYMENT_STATUSES[order.paymentStatus]?.label}
              </Badge>
              {order.paymentReference && (
                <p className="text-xs text-muted-foreground mt-2">Ref: {order.paymentReference}</p>
              )}
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdate orderId={order._id.toString()} currentStatus={order.orderStatus} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
