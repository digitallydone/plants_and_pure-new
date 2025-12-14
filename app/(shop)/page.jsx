// Path: app\(shop)\page.jsx
import Link from "next/link";
import { ArrowRight, Truck, Shield, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Leaf,
    title: "Sustainably Sourced",
    description:
      "All our plants are grown with care using eco-friendly practices.",
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
];

const categories = [
  {
    name: "Spices",
    description:
      "17 premium spice products to add zest and warmth to your favorite dishes.",
    image: "/lush-indoor-potted-plant-monstera.jpg",
    href: "/products?category=indoor",
  },
  {
    name: "Herbs",
    description:
      "2 pure, therapeutic-grade essential oils for culinary and skincare use.",
    image: "/beautiful-outdoor-garden-plant.jpg",
    href: "/products?category=outdoor",
  },
  {
    name: "Essential Oils",
    description: "Everything your plants need",
    image: "/plant-care-products-soil-fertilizer.jpg",
    href: "/products?category=care",
  },
];

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
                Bringing the warmth and goodness of nature into your home with
                our delightful spices, herbs, and essential oils.
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
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by Category
            </h2>
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
                  <h3 className="text-xl font-semibold text-background">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-background/80">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl text-gray-800">
              Our Story
            </h2>
            <div className="w-20 h-1 mx-auto bg-green-700"></div>
          </div>

          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="md:w-1/2">
              <p className="mb-6 text-gray-700">
                Plants & Pure Limited began in 2020, born from a dream to offer
                wholesome, natural products that make life a bit more beautiful
                and healthy. Our founder, a passionate and driven woman,
                believed in the power of quality ingredients and genuine care in
                every product we make.
              </p>
              <p className="mb-6 text-gray-700">
                {`                  Our mission is simple: to inspire and support women who want to create their own businesses with honesty and integrity. We're here to show that it's possible to succeed by sticking to high standards and delivering products that are good for the soul and the body.
`}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center font-medium text-green-700 hover:text-green-800"
              >
                Learn more about us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <img
                  src="/api/placeholder/600/400"
                  alt="Our production facility"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Sustainability Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Quality */}
            <div>
              <h2 className="mb-4 font-serif text-2xl text-gray-800">
                Quality Commitment
              </h2>
              <div className="w-16 h-1 mb-6 bg-green-700"></div>
              <p className="mb-6 text-gray-700">
                {`At Plants & Pure, we believe that our customers deserve
                  nothing but the best. That's why we pour our hearts into
                  maintaining the highest quality standards. Every product is a
                  promise of health and happiness, made with stringent care and
                  lots of love.`}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Ethically sourced ingredients</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Rigorous quality testing</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No artificial preservatives or additives</span>
                </li>
              </ul>
            </div>

            {/* Sustainability */}
            <div>
              <h2 className="mb-4 font-serif text-2xl text-gray-800">
                Community & Sustainability
              </h2>
              <div className="w-16 h-1 mb-6 bg-green-700"></div>
              <p className="mb-6 text-gray-700">
                {`We're more than just a company; we're a community. Our
                  founder's journey is a beacon of hope for women everywhere,
                  proving that you can build a successful business with
                  integrity. Taking care of our planet is a big part of who we
                  are.`}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Empowering women entrepreneurs</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Eco-friendly packaging</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Sustainable sourcing practices</span>
                </li>
              </ul>
            </div>
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
              Join thousands of plant lovers who have discovered the joy of
              bringing nature indoors.
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
  );
}
