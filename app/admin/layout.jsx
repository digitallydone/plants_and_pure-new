import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Star, Settings, Leaf, FolderTree, FileText } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { SessionProvider } from "@/components/providers/session-provider"

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Blog", href: "/admin/blogs", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-border px-6">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-semibold">Admin</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Back to Store */}
            <div className="border-t border-border p-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <span>Back to Store</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  )
}
