import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware executed for path:", request.nextUrl.pathname);

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Token:", token ? "exists" : "does not exist");

    // Redirect logged-in users away from the login page
    if (request.nextUrl.pathname === "/" && token) {
      console.log("User is logged in, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      console.log("Checking access to /dashboard path");
      if (!token) {
        const signInUrl = new URL("/", request.url);
        signInUrl.searchParams.set("callbackUrl", request.url);
        console.log("Redirecting to:", signInUrl.toString());
        return NextResponse.redirect(signInUrl);
      } else {
        console.log("User authenticated, allowing access to /dashboard");
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
  }

  console.log("Middleware completed, continuing to next");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
// import { withAuth } from "next-auth/middleware"
// export default withAuth({
//     callbacks: {
//         authorized: ({ token }) => {
//             return !!token;
//         }
//     },
//     pages: {
//         signIn: '/signin',
//     }
// })

// export const config = {
//     matcher: [
//         "/web/:path*",
//     ]
// }
