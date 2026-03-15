# Multi-Workspace Support

This document explains the multi-workspace feature: how workspaces are stored in Firestore, how authentication works, how to create a workspace, and how to assign posts to it.

---

## Firestore Schema

### Collection: `workspaces`

Each document ID is the **workspace slug** (e.g., `arturo`).

```jsonc
// workspaces/arturo
{
  "slug": "arturo",          // Same as document ID
  "ownerUid": "FIREBASE_UID",
  "isPublic": true,          // Whether the workspace is visible at /w/arturo

  "site": {
    "title": "Ark",
    "subtitle": "Demo Site",
    "lang": "es",
    "themeColor": { "hue": 250, "fixed": false },
    "banner": {
      "enable": true,
      "src": "https://...",
      "position": "center",
      "credit": { "enable": true, "text": "", "url": "" }
    },
    "toc": { "enable": true, "depth": 2 },
    "favicon": []
  },

  "navBar": {
    "links": [0, 1, 2, 3]
    // Numbers are LinkPreset values: 0=Home, 1=Archive, 2=Editor, 3=About
    // Custom links: { "name": "GitHub", "url": "https://...", "external": true }
  },

  "profile": {
    "avatar": "https://...",
    "name": "Arturo",
    "bio": "Descripción del perfil",
    "links": [
      { "name": "GitHub", "icon": "fa6-brands:github", "url": "https://github.com/..." }
    ]
  },

  "license": {
    "enable": true,
    "name": "CC BY-NC-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },

  "expressiveCode": {
    "theme": "github-dark"
  },

  "pages": {
    "about": "# About\n\nMarkdown content for the about page..."
  },

  "updatedAt": "Firestore Timestamp"
}
```

### Collection: `posts`

Each post document now includes a `workspaceId` field:

```jsonc
// posts/my-post-slug
{
  "title": "My Post",
  "slug": "my-post-slug",
  "content": "...",
  "workspaceId": "arturo",   // Must match workspace document ID / slug
  "type": "blog",
  "status": "published",
  "published": "Firestore Timestamp",
  "updatedAt": "Firestore Timestamp",
  // ... other fields
}
```

---

## Required Firebase Custom Claims

Admin users need two custom claims set on their Firebase Auth account:

| Claim | Type | Description |
|-------|------|-------------|
| `admin` | `boolean` | Must be `true` to access admin routes |
| `workspaceSlug` | `string` | The workspace slug this admin manages (e.g., `"arturo"`) |

### Setting custom claims (Firebase Admin SDK)

```js
// Run this in a trusted server environment (e.g., Firebase Functions or a setup script)
const { getAuth } = require('firebase-admin/auth');

await getAuth().setCustomUserClaims('USER_UID_HERE', {
  admin: true,
  workspaceSlug: 'arturo',
});
```

After setting claims, the user must sign in again (or force token refresh) for the claims to take effect.

---

## Session Cookie (`/api/auth/session`)

Authentication uses an **httpOnly cookie** named `__session` containing the Firebase ID token. This avoids exposing tokens in localStorage.

### Login flow

1. The user signs in with Firebase Auth on the client side (e.g., using Firebase SDK with email/password or Google).
2. The client gets the ID token:
   ```js
   const idToken = await firebase.auth().currentUser.getIdToken();
   ```
3. The client POSTs the token to `/api/auth/session`:
   ```js
   await fetch('/api/auth/session/', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ idToken }),
   });
   ```
4. The server verifies the token, checks the `admin: true` claim, and sets the `__session` httpOnly cookie.
5. Subsequent requests to admin API routes include the cookie automatically.

### Logout

```js
await fetch('/api/auth/session/', { method: 'DELETE' });
// Then redirect to home
```

---

## Creating a Workspace

### Option 1: Bootstrap from defaults (recommended)

Once you have an admin account with the correct custom claims:

1. Log in and set the session cookie via `/api/auth/session`.
2. Navigate to `/admin/workspace`.
3. If the workspace doesn't exist yet, click **"Crear workspace con valores por defecto"**.
4. The workspace is created in Firestore at `workspaces/{workspaceSlug}` with defaults from `src/config.ts`.
5. Edit the workspace settings in the UI and click **"Guardar cambios"**.

### Option 2: API call

```bash
curl -X POST https://yourdomain.com/api/workspace/bootstrap/ \
  -H "Cookie: __session=YOUR_ID_TOKEN"
```

---

## Assigning Posts to a Workspace

When creating a post via the API or editor, include `workspaceId`:

```json
POST /api/create-posts/
{
  "title": "My Post",
  "slug": "my-post",
  "content": "...",
  "type": "blog",
  "workspaceId": "arturo"
}
```

Posts with `workspaceId` set will appear in that workspace's public feed at `/w/arturo/`.

---

## Public Workspace Routes

| Route | Description |
|-------|-------------|
| `/w/:slug/` | Workspace home — lists all public posts |
| `/w/:slug/about` | Workspace about page (markdown from Firestore) |
| `/w/:slug/posts/:postSlug` | Individual post reader |

These routes only work if `isPublic: true` in the workspace document.

---

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/workspace` | Workspace settings UI (requires `__session` cookie with `admin: true`) |

### API Routes (require `__session` cookie)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/workspace/get/` | Get current workspace config |
| `POST` | `/api/workspace/update/` | Update workspace config (merge) |
| `POST` | `/api/workspace/bootstrap/` | Create workspace from defaults if missing |
| `POST` | `/api/auth/session/` | Set session cookie from ID token |
| `DELETE` | `/api/auth/session/` | Clear session cookie |

---

## Firestore Security Rules (recommended)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Workspaces: admin reads/writes, public reads if isPublic
    match /workspaces/{slug} {
      allow read: if resource.data.isPublic == true || request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true 
                   && request.auth.token.workspaceSlug == slug;
    }

    // Posts: admin writes, public reads workspace posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```
