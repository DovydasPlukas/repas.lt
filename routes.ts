/**
 * An array of public routes that do not require authentication.
 */
export const publicRoutes = [
    "/",
    "/apie-mus",
    "/kontaktai",
    '/skalbimas',
    '/kostiumu-valymas',
    '/lyginimas',
    '/patalines-valymas',
    '/skalbimo-masinu-tvarkymas',
    '/paslaugos',
    '/privacy-notice',
    '/terms-and-conditions',
]

/**
* An array of authentication-related routes.
*/
export const authRoutes = [
    "/prisijungimas",
    "/registracija"
]

/**
* API auth route prefix.
* API authentication purposes.
*/
export const apiAuthPrefix = "/api/auth";

/**
* Default redirect path after successful login.
*/
export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * An array of route prefixes that should be considered protected.
 * Middleware will only redirect for paths that match one of these prefixes.
 */
export const protectedPrefixes = ["/dashboard", "/settings"];