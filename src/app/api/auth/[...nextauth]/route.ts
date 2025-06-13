import {signInUserBody} from "@/services/authservice.service";
import {authenticateWithGoogle} from "@/services/google.service";
import NextAuth, {DefaultSession, NextAuthOptions, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// ✅ Extend types inside this file (optional if already in types.d.ts)
declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
    error?: string;
    user: {
      username: string;
      token: string;
      role?: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    token: string;
    role?: string;
    email?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    username?: string;
    role?: string;
    email?: string;
    exp?: number;
    iat?: number;
    jti?: string;
  }
}

// ✅ jwt callback (no export)
const jwt = async ({
  token,
  user,
  account,
}: {
  token: JWT;
  user?: User;
  account?: any;
}) => {
  if (user) {
    if (user.token) {
      token.username = user.username;
      token.token = user.token;
      token.email = user.email;
    } else if (account?.provider === "google") {
      try {
        const googleAuthData = {
          googleId: user.id!,
          email: user.email || "",
          name: user.name || "",
          image: user.image || "",
        };

        const response = await authenticateWithGoogle(googleAuthData);
        if (response.status === 200 && response.data) {
          token.token = response.data.token || response.data.accessToken;
          token.username = response.data.username || user.username;
          token.email = response.data.email || user.email;
          if (response.data.role) {
            token.role = response.data.role;
          }
        } else {
          token.token = "google-auth-failed";
        }
      } catch (error) {
        console.error("Google auth error:", error);
        token.token = "google-auth-error";
      }
    }
  }
  return token;
};

// ✅ session callback (no export)
const session = async ({session, token}: {session: any; token: JWT}) => {
  if (session.user) {
    session.user = {
      ...session.user,
      username: token.username || "",
      token: token.token,
      role: token.role || "USER",
      email: token.email || session.user.email,
    };
  }
  session.token = token.token;
  return session;
};

// ✅ Define authOptions (DO NOT export it)
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await signInUserBody({
            username: credentials.username,
            password: credentials.password,
          });

          if (response.status === 200 && response.data) {
            return response.data;
          }
        } catch (error) {
          console.error("Credentials login error:", error);
        }

        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email?.split("@")[0] || "",
          token: "",
          role: "ADMIN",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },

  callbacks: {
    jwt,
    session,
    async redirect({url, baseUrl}) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/",
  },

  debug: process.env.NODE_ENV === "development",
};

// ✅ Only export GET and POST for App Router
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
