import {signInUserBody} from "@/services/authservice.service";
import {authenticateWithGoogle} from "@/services/google.service";
import NextAuth, {DefaultSession, NextAuthOptions, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
    error?: string;
    user: {
      username: string;
      token: string;
      role?: string;
    } & DefaultSession["user"];
  }
  interface User {
    username: string;
    token: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    username?: string;
    role?: string;
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
  // If this is a sign-in
  if (user) {
    // For credential provider
    if (user.token) {
      token.username = user.username;
      token.token = user.token;
    } // For Google provider
    else if (account?.provider === "google") {
      try {
        token.username = user.username || "";

        // Send Google user data to backend for authentication/registration
        const googleAuthData = {
          googleId: user.id!,  // ✅ Fixed: Changed from 'id' to 'googleId'
          email: user.email || "",
          name: user.name || "",
          image: user.image || "",
        };

        console.log(
          "Authenticating Google user as admin:",
          googleAuthData.email
        );
        const response = await authenticateWithGoogle(googleAuthData);

        if (response.status === 200 && response.data) {
          console.log("Google admin authentication successful");
          // Store the token from your backend
          token.token = response.data.token || response.data.accessToken;
          token.username = response.data.username || user.username;

          // Store additional admin info if available
          if (response.data.role) {
            token.role = response.data.role;
          }

          console.log("Admin token set:", token.token);
        } else {
          console.error(
            "Failed to authenticate with Google on backend:",
            response
          );
          token.token = "google-auth-failed"; // This will be used to detect authentication failures
        }
      } catch (error) {
        console.error(
          "Error during Google authentication with backend:",
          error
        );
        token.token = "google-auth-error";
      }
    }
  }
  return token;
};

export const session = async ({session, token}: {session: any; token: JWT}) => {
  if (session.user) {
    session.user = {
      ...session.user,
      username: (token as JWT & {username: string}).username || "",
      token: token.token,
      role: token.role || "USER",
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
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"},
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
          })) as {status: number; data: any};

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email?.split("@")[0] || "", // Create a username from email
          token: "", // This will be handled by the JWT callback
          role: "ADMIN", // Default role for Google auth users
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: (2 * 60 - 2) * 60, // 2 hours
  },
  callbacks: {
    jwt,
    session,
    async redirect({url, baseUrl}) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
