import { auth } from "@/lib/auth";
// import { matchPolicy } from "@/lib/protect/policy";
import { NextResponse } from "next/server";

export default auth((req) => {
  // const { pathname } = req.nextUrl;
  const session = req.auth;

  // const policy = matchPolicy(pathname);
  // if (!policy) return;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // const userRoles = session.user.roles ?? [];
  // const hasRole = policy.roles.some((r) => userRoles.includes(r));

  // if (!hasRole) {
  //   return NextResponse.redirect(new URL("/not-found", req.url));
  // }

  const response = NextResponse.next();
  // response.headers.set("x-policy-id", policy.id);
  // if (policy.scope) {
  //   response.headers.set("x-policy-scope", policy.scope);
  // }
  // if (policy.resourceParam) {
  //   response.headers.set("x-resource-param", policy.resourceParam);
  // }

  return response;
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
