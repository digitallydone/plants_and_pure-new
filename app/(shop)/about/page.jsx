import { Leaf, Heart, Users, Award, Sparkles } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "Quality Ingredients",
    description:
      "Each spice, herb, and oil in our collection is carefully selected and ethically sourced for maximum freshness and potency.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every product is packaged with love and care, maintaining the same dedication we had from day one in our home kitchen.",
  },
  {
    icon: Users,
    title: "Empowering Women",
    description:
      "We're committed to supporting and empowering women entrepreneurs, creating opportunities for growth and success.",
  },
  {
    icon: Sparkles,
    title: "Sustainability",
    description:
      "We believe in sustainable practices, from ethical sourcing to eco-friendly packaging that cares for our planet.",
  },
]

const stats = [
  { value: "2020", label: "Founded" },
  { value: "100+", label: "Products" },
  { value: "10K+", label: "Happy Customers" },
  { value: "Nationwide", label: "Delivery" },
]

const milestones = [
  {
    year: "2020",
    title: "A Dream Begins",
    description:
      "Plants & Pure Limited started in a home kitchen, born from a passion for wholesome, natural products.",
  },
  {
    year: "2021",
    title: "Growing Together",
    description: "Expanded our product line and began serving customers across multiple cities.",
  },
  {
    year: "2022",
    title: "Nationwide Reach",
    description: "Launched nationwide delivery, bringing quality spices and herbs to homes across the country.",
  },
  {
    year: "2023",
    title: "Community Impact",
    description: "Started our women empowerment initiative, supporting female entrepreneurs in the industry.",
  },
  {
    year: "2024",
    title: "Continued Growth",
    description:
      "Expanded our collection to include premium oils and wellness products while maintaining our quality promise.",
  },
]

export const metadata = {
  title: "About Us | Plants & Pure",
  description: "Learn about Plants & Pure Limited - offering wholesome, natural products since 2020.",
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-accent/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                Wholesome, Natural Products Made with Love
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Plants & Pure Limited began in 2020, born from a dream to offer wholesome, natural products that make
                life a bit more beautiful and healthy. Our founder, a passionate and driven woman, believed in the power
                of quality ingredients and genuine care in every product we make.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                What started as a small operation in a home kitchen has now grown into a thriving business that serves
                customers nationwide. Throughout our growth, we've maintained our commitment to quality, sustainability,
                and empowering other women entrepreneurs.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Each spice, herb, and oil in our collection is carefully selected, ethically sourced, and packaged with
                love. We take pride in creating products that not only enhance your culinary adventures but also
                contribute to your overall wellbeing.
              </p>
            </div>
            <div className="relative">
              <img
                src="/woman-entrepreneur-with-natural-spices-herbs-and-o.jpg"
                alt="Our founder with natural products"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold">Our Journey</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From a home kitchen to nationwide delivery, here's how we've grown while staying true to our values.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden lg:block" />
            <div className="space-y-8 lg:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col lg:flex-row items-center gap-4 lg:gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                      <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      <h3 className="font-semibold text-lg mt-1">{milestone.title}</h3>
                      <p className="text-muted-foreground mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold">Our Values</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from sourcing to delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6 rounded-lg bg-card border border-border">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 lg:py-24 bg-accent/30">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold mb-6">Our Promise</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            "We promise to continue delivering products that are not just good for you, but good for the community and
            the environment. Every purchase you make supports our mission to empower women and promote sustainable,
            ethical sourcing practices."
          </p>
          <p className="mt-4 font-semibold text-primary">- Founder, Plants & Pure Limited</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground">Experience the Pure Difference</h2>
          <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">
            Browse our collection of ethically sourced spices, herbs, and oils.
          </p>
          <a
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-background px-6 py-3 font-medium text-foreground hover:bg-background/90 transition-colors"
          >
            Shop Our Products
          </a>
        </div>
      </section>
    </div>
  )
}
