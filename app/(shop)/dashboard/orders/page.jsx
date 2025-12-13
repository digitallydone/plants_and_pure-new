import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

async function getUserOrders(userId) {
  await dbConnect()
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean()
  return orders
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Order History</h2>
        <p className="text-sm text-muted-foreground">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start shopping to see your orders here</p>
            <Link href="/products" className="mt-4">
              <Badge variant="secondary" className="cursor-pointer">
                Browse Products
              </Badge>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/dashboard/orders/${order._id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-secondary/50 flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        <p className="text-sm font-medium mt-1">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={ORDER_STATUSES[order.orderStatus]?.color || "bg-secondary"}>
                          {ORDER_STATUSES[order.orderStatus]?.label || order.orderStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {PAYMENT_STATUSES[order.paymentStatus]?.label || order.paymentStatus}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
