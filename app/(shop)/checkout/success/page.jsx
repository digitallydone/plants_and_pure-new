import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Order Confirmed | PLANTS and PURE",
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams
  const orderNumber = params.order

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>

      <h1 className="font-serif text-3xl font-bold mt-6">Thank You for Your Order!</h1>
      <p className="text-muted-foreground mt-2">Your order has been confirmed and will be shipped soon.</p>

      {orderNumber && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Order Number:</span>
              <span className="font-mono font-semibold">{orderNumber}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground mt-6">We've sent a confirmation email with your order details.</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link href="/dashboard/orders">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            View Order Status
          </Button>
        </Link>
        <Link href="/products">
          <Button className="w-full sm:w-auto gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
