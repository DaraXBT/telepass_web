import {signInUserBody} from "@/services/authservice.service";
import NextAuth, {NextAuthOptions, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    token?: string;
    error?: string;
    user: {
      username: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    username?: string;
    exp?: number;
    iat?: number;
    jti?: string;
  }
}

// Define the JWT callback
export const jwt = async ({token, user}: {token: JWT; user?: User}) => {
  if (user) {
    token.username = user.username;
    token.token = user.token;
  }
  return token;
};

// Define the session callback
export const session = async ({session, token}: {session: any; token: JWT}) => {
  if (session.user) {
    session.user = {
      ...session.user,
      username: token.username || "",
      token: token.token,
    };
  }
  session.token = token.token;
  return session;
};

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const response = await signInUserBody({
            username: credentials.username,
            password: credentials.password,
          });

          if (response.status === 200 && response.data) {
            return response.data;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2 hours
  },
  callbacks: {
    jwt,
    session,
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
};

// Export the handler for GET and POST requests only
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
