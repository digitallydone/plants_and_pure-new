import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/dashboard/profile-form"
import dbConnect from "@/lib/db"
import User from "@/models/User"

async function getUserProfile(userId) {
  await dbConnect()
  const user = await User.findById(userId).select("name email image").lean()
  return user
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await getUserProfile(session.user.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={JSON.parse(JSON.stringify(user))} />
        </CardContent>
      </Card>
    </div>
  )
}
