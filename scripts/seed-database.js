// Run this script to seed initial data into your MongoDB database
// Execute with: node scripts/seed-database.js

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI environment variable")
  process.exit(1)
}

// Define schemas inline for seeding
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
})

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  comparePrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [String],
  stock: Number,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
})

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema)
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)

const categories = [
  {
    name: "Indoor Plants",
    slug: "indoor-plants",
    description: "Beautiful plants perfect for indoor spaces",
    image: "/indoor-monstera-plant.jpg",
  },
  {
    name: "Outdoor Plants",
    slug: "outdoor-plants",
    description: "Hardy plants for your garden and patio",
    image: "/outdoor-garden-plants.jpg",
  },
  {
    name: "Succulents",
    slug: "succulents",
    description: "Low-maintenance succulents and cacti",
    image: "/succulents-collection.jpg",
  },
  {
    name: "Plant Care",
    slug: "plant-care",
    description: "Everything you need to care for your plants",
    image: "/plant-care-supplies.jpg",
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await Category.deleteMany({})
    await Product.deleteMany({})
    console.log("Cleared existing data")

    // Create categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`Created ${createdCategories.length} categories`)

    // Create products
    const products = [
      {
        name: "Monstera Deliciosa",
        slug: "monstera-deliciosa",
        description:
          "The iconic Swiss Cheese Plant with beautiful split leaves. Perfect for adding a tropical touch to any room.",
        price: 4500,
        comparePrice: 5500,
        category: createdCategories[0]._id,
        images: ["/monstera-deliciosa-plant.jpg"],
        stock: 25,
        isFeatured: true,
        tags: ["tropical", "air-purifying", "low-light"],
      },
      {
        name: "Fiddle Leaf Fig",
        slug: "fiddle-leaf-fig",
        description: "A stunning statement plant with large, violin-shaped leaves that brings elegance to any space.",
        price: 6500,
        category: createdCategories[0]._id,
        images: ["/fiddle-leaf-fig.png"],
        stock: 15,
        isFeatured: true,
        tags: ["statement", "bright-light"],
      },
      {
        name: "Snake Plant",
        slug: "snake-plant",
        description: "One of the most tolerant plants around. Great for beginners and known for air purification.",
        price: 2500,
        category: createdCategories[0]._id,
        images: ["/snake-plant-sansevieria.png"],
        stock: 50,
        isFeatured: true,
        tags: ["beginner-friendly", "air-purifying", "low-light"],
      },
      {
        name: "Pothos Golden",
        slug: "pothos-golden",
        description: "Easy-care trailing vine with heart-shaped leaves. Perfect for shelves and hanging baskets.",
        price: 1800,
        category: createdCategories[0]._id,
        images: ["/golden-pothos.png"],
        stock: 40,
        tags: ["trailing", "beginner-friendly", "low-light"],
      },
      {
        name: "Lavender",
        slug: "lavender",
        description: "Fragrant purple flowers that attract pollinators. Perfect for sunny garden spots.",
        price: 1500,
        category: createdCategories[1]._id,
        images: ["/lavender-plant-flowers.jpg"],
        stock: 30,
        tags: ["fragrant", "pollinator-friendly", "drought-tolerant"],
      },
      {
        name: "Rosemary",
        slug: "rosemary",
        description: "Aromatic herb perfect for cooking and garden borders. Thrives in sunny conditions.",
        price: 1200,
        category: createdCategories[1]._id,
        images: ["/rosemary-herb-plant.jpg"],
        stock: 35,
        tags: ["herb", "culinary", "drought-tolerant"],
      },
      {
        name: "Echeveria Collection",
        slug: "echeveria-collection",
        description: "Set of 3 beautiful rosette-shaped succulents in assorted colors.",
        price: 2200,
        comparePrice: 2800,
        category: createdCategories[2]._id,
        images: ["/echeveria-succulent-collection.jpg"],
        stock: 20,
        isFeatured: true,
        tags: ["succulent", "low-maintenance", "colorful"],
      },
      {
        name: "Aloe Vera",
        slug: "aloe-vera",
        description: "Medicinal plant with soothing gel inside its leaves. Easy to care for.",
        price: 1600,
        category: createdCategories[2]._id,
        images: ["/aloe-vera-plant.png"],
        stock: 45,
        tags: ["medicinal", "succulent", "beginner-friendly"],
      },
      {
        name: "Premium Potting Mix",
        slug: "premium-potting-mix",
        description: "Nutrient-rich soil blend perfect for indoor plants. 5L bag.",
        price: 800,
        category: createdCategories[3]._id,
        images: ["/potting-soil-mix-bag.jpg"],
        stock: 100,
        tags: ["soil", "essential"],
      },
      {
        name: "Ceramic Plant Pot - White",
        slug: "ceramic-pot-white",
        description: "Elegant white ceramic pot with drainage hole. 15cm diameter.",
        price: 1400,
        category: createdCategories[3]._id,
        images: ["/white-ceramic-plant-pot.jpg"],
        stock: 60,
        tags: ["pot", "ceramic", "minimalist"],
      },
    ]

    const createdProducts = await Product.insertMany(products)
    console.log(`Created ${createdProducts.length} products`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seed()
