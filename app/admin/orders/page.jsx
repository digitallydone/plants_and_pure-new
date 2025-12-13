import Link from "next/link"
import { MoreHorizontal, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

async function getOrders() {
  await dbConnect()
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).lean()
  return orders
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{order.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">
                      <Badge className={PAYMENT_STATUSES[order.paymentStatus]?.color}>
                        {PAYMENT_STATUSES[order.paymentStatus]?.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={ORDER_STATUSES[order.orderStatus]?.color}>
                        {ORDER_STATUSES[order.orderStatus]?.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="text-center py-8 text-muted-foreground">No orders yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
