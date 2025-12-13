import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format"
import dbConnect from "@/lib/db"
import User from "@/models/User"

async function getCustomers() {
  await dbConnect()
  const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean()
  return customers
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">View and manage your customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Addresses</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">{customer.name?.charAt(0) || "U"}</span>
                        </div>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{customer.email}</td>
                    <td className="py-3 px-4 text-sm">{formatDate(customer.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{customer.addresses?.length || 0} addresses</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No customers yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
