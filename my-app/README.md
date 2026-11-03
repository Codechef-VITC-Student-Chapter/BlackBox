# BLACKBOX Core Platform

BLACKBOX is an offline engineering event platform where teams progress through modules one at a time. This repository owns the reusable core: MongoDB data models, JWT authentication, HTTP-only cookie sessions, centralized module access control, and engine helpers for future module teams.

## Stack

- Next.js App Router with TypeScript
- Next.js Route Handlers for backend APIs
- MongoDB with Mongoose
- JWT signed with `HS256` and stored in HTTP-only cookies

## Folder Structure

- `src/app/api/auth/*` contains login, logout, and current-user route handlers.
- `src/app/api/platform/*` exposes platform-level authenticated APIs.
- `src/app/module/[module]` is the guarded module shell future teams can replace.
- `src/config` contains shared game and environment configuration.
- `src/engine` contains reusable game-engine and challenge-generator functions.
- `src/lib/auth` contains JWT, cookie, and session helpers.
- `src/lib/db` contains the cached MongoDB connection.
- `src/models` contains `Team`, `Progress`, and `Submission` Mongoose models.
- `src/validators` contains request and domain validators.
- `src/proxy.ts` is the Next.js 16 proxy layer. It replaces the older middleware convention and guards `/module/[n]`.

## Environment

Create a local `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/blackbox
JWT_SECRET=replace-with-a-long-random-secret
```

Do not commit `.env.local`.

## Data Models

`Team`

- `teamId`
- `teamName`
- `loginPin`
- `eventToken`
- `currentModule`
- `score`
- `createdAt`

`Progress`

- `teamId`
- `module`
- `completed`
- `attempts`
- `completedAt`

`Submission`

- `teamId`
- `module`
- `submittedAnswer`
- `isCorrect`
- `submittedAt`

## Authentication Flow

1. Client posts `{ "teamId": "T017", "pin": "4839" }` to `POST /api/auth/login`.
2. The route validates MongoDB `Team.loginPin`.
3. The server signs a JWT containing only `{ teamId }`.
4. The token is stored in the `blackbox_session` HTTP-only cookie.
5. `GET /api/auth/me` loads the team from MongoDB using the cookie token.
6. `POST /api/auth/logout` clears the cookie.

## Module Guard Flow

`src/proxy.ts` runs before protected module pages:

1. Reads the `blackbox_session` cookie.
2. Verifies the JWT.
3. Loads the latest team from MongoDB.
4. Redirects unauthenticated users to `/authentication`.
5. Allows only `/module/{team.currentModule}`.
6. Redirects previous or future module URLs back to the current module.

The JWT intentionally stores only `teamId`; `currentModule` is always loaded server-side to prevent stale or tampered access decisions.

## Game Engine

`src/engine/gameEngine.ts` exposes reusable functions:

- `getCurrentModule(teamId)`
- `unlockNextModule(teamId)`
- `updateScore(teamId, delta)`
- `logSubmission(input)`
- `completeModule(teamId, module)`

These functions do not know puzzle logic. Future module APIs should call them after validating module-specific answers.

## Challenge Generator

`src/engine/challengeGenerator.ts` exposes:

- `generateExpectedValue({ eventToken, module })`
- `registerModuleGenerator(module, generator)`

The default generator returns a deterministic token-derived value so the architecture is runnable. Future teams should register `generateModule1`, `generateModule2`, and so on without storing static correct answers.

## Manual Setup Before Testing

1. Create `.env.local` with `MONGODB_URI` and `JWT_SECRET`.
2. Start MongoDB locally or use a MongoDB Atlas URI.
3. Insert at least one test team:

```javascript
db.teams.insertOne({
  teamId: "T017",
  teamName: "Team 017",
  loginPin: "4839",
  eventToken: "BBX-T017-A91XZK",
  currentModule: 3,
  score: 0,
  createdAt: new Date()
})
```

## Test Before Pushing

Run these commands from this folder:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Then test the API and guard:

```bash
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"teamId":"T017","pin":"4839"}' \
  http://localhost:3000/api/auth/login

curl -i -b cookies.txt http://localhost:3000/api/auth/me
curl -i -b cookies.txt http://localhost:3000/module/3
curl -i -b cookies.txt http://localhost:3000/module/1
curl -i -b cookies.txt http://localhost:3000/module/4
```

Expected results:

- Login returns `200` and sets `blackbox_session`.
- `/api/auth/me` returns the authenticated team.
- `/module/3` opens for a team whose `currentModule` is `3`.
- `/module/1` and `/module/4` redirect back to `/module/3`.

After this passes, review changed files with `git status`, stage the intended files, commit, and push.
