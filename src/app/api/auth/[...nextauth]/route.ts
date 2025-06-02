import { signInUserBody } from "@/services/authservice.service";
import NextAuth, { DefaultSession, NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
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

export const jwt = async ({
  token,
  user,
  account,
}: {
  token: JWT;
  user?: User;
  account?: any;
}) => {
  if (user) {
    token.username = user.username;
    token.token = user.token;
  }
  return token;
};

export const session = async ({
  session,
  token,
}: {
  session: any;
  token: JWT;
}) => {
  if (session.user) {
    session.user = {
      ...session.user,
      username: (token as JWT & { username: string }).username || "",
      token: token.token,
    };
  }
  session.token = token.token;
  return session;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting to authenticate user:", credentials.username);
          const response = (await signInUserBody({
            username: credentials.username,
            password: credentials.password,
          })) as { status: number; data: any };

          console.log("Auth response:", response);

          if (response.status === 200 && response.data) {
            console.log("Authentication successful");
            return response.data;
          } else {
            console.log("Authentication failed - invalid response");
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   // async profile(profile) {
    //   //     console.log("profile", profile);
    //   //   return profile.username;
    //   // }
    // }),
  ],
  session: {
    strategy: "jwt",
    maxAge: (2 * 60 - 2) * 60, // 2 hours
  },
  callbacks: {
    jwt,
    session,
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl + "/dashboard";
    // },
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
