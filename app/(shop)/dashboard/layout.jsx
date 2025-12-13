import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { User, Package, MapPin, Heart, Star } from "lucide-react"
import { authOptions } from "@/lib/auth-options"

const sidebarLinks = [
  { name: "Account", href: "/dashboard", icon: User },
  { name: "Orders", href: "/dashboard/orders", icon: Package },
  { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
]

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-serif text-3xl font-bold mb-8">My Account</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <nav className="lg:col-span-1">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  )
}
