import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/db/connect"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }
        const isPasswordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!isPasswordMatch) {
          return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isPremium: user.isPremium,
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.isPremium = user.isPremium;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).isPremium = token.isPremium;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
