import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(fr|en|ar)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)",
  ],
};
