import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { MapPin, Plus } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddressForm } from "@/components/dashboard/address-form"
import dbConnect from "@/lib/db"
import User from "@/models/User"

async function getUserAddresses(userId) {
  await dbConnect()
  const user = await User.findById(userId).select("addresses").lean()
  return user?.addresses || []
}

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const addresses = await getUserAddresses(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <AddressForm>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </AddressForm>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mt-1">Add an address for faster checkout</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.label}</p>
                      {address.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
