import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password")
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          throw new Error("No user found with this email")
        }

        // Check if user signed up with OAuth
        if (user.provider !== "credentials" && !user.password) {
          throw new Error(`Please sign in with ${user.provider}`)
        }

        if (!user.password) {
          throw new Error("Please sign in with your social account")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect()

        const existingUser = await User.findOne({ email: user.email })

        if (existingUser) {
          // Update existing user with Google info if not already set
          if (!existingUser.image && user.image) {
            existingUser.image = user.image
          }
          if (!existingUser.providerId && account.providerAccountId) {
            existingUser.provider = "google"
            existingUser.providerId = account.providerAccountId
          }
          await existingUser.save()
        } else {
          // Create new user
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            providerId: account.providerAccountId,
            emailVerified: new Date(),
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Get user from database to ensure we have the role
        await dbConnect()
        const dbUser = await User.findOne({ email: user.email })

        token.id = dbUser?._id.toString() || user.id
        token.role = dbUser?.role || "user"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
