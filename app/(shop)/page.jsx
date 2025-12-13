import Link from "next/link"
import { ArrowRight, Truck, Shield, Leaf, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Leaf,
    title: "Sustainably Sourced",
    description: "All our plants are grown with care using eco-friendly practices.",
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    description: "Plants carefully packaged and delivered to your doorstep.",
  },
  {
    icon: Shield,
    title: "Plant Guarantee",
    description: "30-day guarantee on all plants. Your satisfaction matters.",
  },
  {
    icon: Sparkles,
    title: "Expert Care Tips",
    description: "Get personalized care guides with every purchase.",
  },
]

const categories = [
  {
    name: "Indoor Plants",
    description: "Perfect for brightening up any room",
    image: "/lush-indoor-potted-plant-monstera.jpg",
    href: "/products?category=indoor",
  },
  {
    name: "Outdoor Plants",
    description: "Transform your garden and patio",
    image: "/beautiful-outdoor-garden-plant.jpg",
    href: "/products?category=outdoor",
  },
  {
    name: "Plant Care",
    description: "Everything your plants need",
    image: "/plant-care-products-soil-fertilizer.jpg",
    href: "/products?category=care",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Bring Nature Into Your Home
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Discover our curated collection of beautiful plants and pure, natural products. Transform your space
                into a green sanctuary.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/beautiful-arrangement-of-indoor-plants-aesthetic.jpg"
                alt="Beautiful plant arrangement"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Find the perfect plants for every corner of your life.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-background">{category.name}</h3>
                  <p className="mt-1 text-sm text-background/80">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-16 text-center sm:px-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
              Join thousands of plant lovers who have discovered the joy of bringing nature indoors.
            </p>
            <div className="mt-8">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="gap-2">
                  Explore Our Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
