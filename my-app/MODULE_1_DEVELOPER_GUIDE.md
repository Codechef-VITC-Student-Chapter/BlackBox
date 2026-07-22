# Module 1: Authentication & Access Control - Developer Guide

## Overview
Module 1 implements a secure authentication flow using JWT tokens with embedded hidden routes. Teams authenticate using Event ID and PIN, receive a JWT token in an HttpOnly cookie, decode it to find their hidden route, and access the next module.

## Architecture

### Authentication Flow
1. **Authentication Request**: `POST /api/auth/login`
   - Input: `{ eventId, pin }`
   - Output: Team data + JWT token in `blackbox_session` cookie
   - JWT contains: `teamId`, `eventId`, `pin`, `hiddenRoute`

2. **Hidden Route Access**: `GET /access/[hiddenRoute]`
   - Validates JWT token from cookie
   - Verifies hidden route matches JWT payload
   - Checks team exists in database
   - Shows "Access Granted" page (can be replaced with Module 2 content)

### Key Components

#### API Endpoints
- **`/api/auth/login`** - Authentication endpoint
  - Location: `src/app/api/auth/login/route.ts`
  - Validates eventId and pin against database
  - Generates JWT with hidden route containing team attributes
  - Sets HttpOnly cookie

- **`/access/[hiddenRoute]`** - Hidden route access page
  - Location: `src/app/access/[hiddenRoute]/page.tsx`
  - Validates JWT and hidden route
  - Checks team existence
  - Shows access granted/denied messages

#### Database Schema
- **Team Model**: `src/models/Team.ts`
  - Extended with `eventId` and `loginPin` fields
  - Used for authentication validation

#### JWT Implementation
- **JWT Functions**: `src/lib/auth/jwt.ts`
  - `signAuthToken()` - Creates JWT with team data
  - `verifyAuthToken()` - Validates JWT signature and expiration

- **Cookie Management**: `src/lib/auth/cookies.ts`
  - `setAuthCookie()` - Sets HttpOnly cookie with JWT
  - `clearAuthCookie()` - Removes authentication cookie

#### Configuration
- **Game Config**: `src/config/game.ts`
  - `authCookieName`: "blackbox_session"
  - `authCookieMaxAgeSeconds`: 28800 (8 hours)

- **Environment Variables**: `.env`
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT signing

## Hidden Route Format

Hidden routes include team attributes for unique URLs per team:
```
module-{nextModule}-{eventId}-{pin}-{teamId}
```

Example: `module-2-BLACKBOX2026-483921-TEAM001`

## Testing

### Seed Database
```bash
npm run tsx scripts/seed-db.ts
```

### Test Authentication
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"eventId": "BLACKBOX2026", "pin": "483921"}' \
  -c cookies.txt
```

### Test Hidden Route Access
```bash
curl "http://localhost:3000/access/module-2-BLACKBOX2026-483921-TEAM001" \
  -b cookies.txt
```

## Development Notes

### For Development (Cookie Visibility)
To view cookies in browser DevTools during development, temporarily set `httpOnly: false` in `src/lib/auth/cookies.ts`. Remember to revert to `httpOnly: true` for production.

### Module 2 Integration
The hidden route page (`src/app/access/[hiddenRoute]/page.tsx`) currently shows an "Access Granted" message. To integrate Module 2:

1. Replace the success message with Module 2 content
2. Or redirect to Module 2: `redirect('/module/2')`
3. The JWT payload contains all team data needed for module progression

### Security Considerations
- JWT tokens are signed with HS256 using `JWT_SECRET`
- Cookies are HttpOnly to prevent XSS attacks
- SameSite=lax for CSRF protection
- Secure flag set in production (HTTPS only)
- Hidden routes include team attributes for unique access paths

### ⚠️ CRITICAL SECURITY VULNERABILITIES

**HIGH SEVERITY:**
1. **PIN exposed in JWT payload** - The team's PIN is included in the JWT token. Anyone who decodes the JWT can see the team's PIN. This allows participants to share credentials and bypass individual team authentication.

2. **PIN exposed in hidden route URL** - The hidden route format `module-{nextModule}-{eventId}-{pin}-{teamId}` includes the PIN in plain text in the URL. This allows participants to see and share other teams' PINs by examining URLs.

3. **PIN stored in plain text in database** - The `loginPin` field in the Team model stores PINs in plain text. PINs should be hashed using bcrypt or similar.

**MEDIUM SEVERITY:**
4. **No rate limiting** - The login endpoint has no rate limiting, making it vulnerable to brute force attacks.

5. **Basic input validation** - Input validation only checks for non-empty strings without length limits or format validation.

6. **Predictable hidden routes** - Hidden routes follow a predictable pattern that could be guessed if someone knows the team ID and event ID.

**RECOMMENDED FIXES:**
- Remove PIN from JWT payload and hidden route URL
- Hash PINs in database using bcrypt
- Add rate limiting to login endpoint
- Add stronger input validation
- Consider using random tokens instead of predictable hidden routes
- Add IP-based restrictions or session validation

## File Structure
```
src/
├── app/
│   ├── api/auth/login/route.ts       # Authentication API
│   ├── authentication/page.tsx        # Authentication challenge UI
│   └── access/[hiddenRoute]/page.tsx  # Hidden route access validation
├── lib/
│   ├── auth/jwt.ts                   # JWT signing/verification
│   └── auth/cookies.ts               # Cookie management
├── models/Team.ts                    # Team database model
├── config/
│   ├── game.ts                       # Game configuration
│   └── env.ts                        # Environment variables
└── validators/auth.ts                # Input validation
```

## Environment Setup
Create `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/blackbox
JWT_SECRET=your-secret-key-here
```

## Mock Data
Seed script creates test teams:
- Event ID: `BLACKBOX2026`
- Team PINs: `483921`, `123456`, `789012`
- Team IDs: `TEAM001`, `TEAM002`, `TEAM003`

## Next Steps for Module Development
1. Module 2 content should be placed in `/access/[hiddenRoute]/page.tsx` or redirect to `/module/2`
2. Use JWT payload data for team-specific content
3. Implement module progression logic (update team's currentModule)
4. Add module-specific scoring and submission handling
