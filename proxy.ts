import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const protectedPrefixes = [
  "/dashboard",
  "/trackers",
  "/templates",
  "/analytics",
  "/reports",
  "/ai-assistant",
  "/settings",
  "/onboarding",
];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return response;
  }

  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!isConfigured) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/login?error=auth_not_configured", request.url));
    }

    return response;
  }

  try {
    const sessionResponse = await updateSession(request, response);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => undefined,
      },
    });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return sessionResponse;
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/login?error=auth_unavailable", request.url));
    }

    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
