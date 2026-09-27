import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/dashboard/login",
  },
  useSecureCookies:
    process.env.NODE_ENV === "production" &&
    process.env.NEXTAUTH_URL?.startsWith("https://"),
  providers: [
    CredentialsProvider({
      name: "Giriş Yap",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text", placeholder: "mehmet" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Kullanıcı adı ve şifre zorunludur.");
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (!admin) {
          throw new Error("Geçersiz giriş bilgileri.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);

        if (!isPasswordValid) {
          throw new Error("Geçersiz giriş bilgileri.");
        }

        return {
          id: admin.id.toString(),
          name: admin.name,
          email: admin.username, // keep email field for session compatibility, but map it to username
        };
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs without prepending baseUrl
      if (url.startsWith("/")) return url;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        return baseUrl;
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

