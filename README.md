# 🍥Fuwari  
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

A static blog template built with [Astro](https://astro.build).

[**🖥️ Live Demo (Vercel)**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 README in
[**中文**](https://github.com/saicaca/fuwari/blob/main/docs/README.zh-CN.md) /
[**日本語**](https://github.com/saicaca/fuwari/blob/main/docs/README.ja.md) /
[**한국어**](https://github.com/saicaca/fuwari/blob/main/docs/README.ko.md) /
[**Español**](https://github.com/saicaca/fuwari/blob/main/docs/README.es.md) /
[**ไทย**](https://github.com/saicaca/fuwari/blob/main/docs/README.th.md) /
[**Tiếng Việt**](https://github.com/saicaca/fuwari/blob/main/docs/README.vi.md) /
[**Bahasa Indonesia**](https://github.com/saicaca/fuwari/blob/main/docs/README.id.md) (Provided by the community and may not always be up-to-date)

## ✨ Features

- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Customizable theme colors & banner
- [x] Responsive design
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed

## 🚀 Getting Started

1. Create your blog repository:
    - [Generate a new repository](https://github.com/saicaca/fuwari/generate) from this template or fork this repository.
    - Or run one of the following commands:
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. To edit your blog locally, clone your repository, run `pnpm install` to install dependencies.
    - Install [pnpm](https://pnpm.io) `npm install -g pnpm` if you haven't.
3. Edit the config file `src/config.ts` to customize your blog.
4. Run `pnpm new-post <filename>` to create a new post and edit it in `src/content/posts/`.
5. Deploy your blog to Vercel, Netlify, GitHub Pages, etc. following [the guides](https://docs.astro.build/en/guides/deploy/). You need to edit the site configuration in `astro.config.mjs` before deployment.

## 📝 Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # Set only if the post's language differs from the site's language in `config.ts`
---
```

## 🧩 Markdown Extended Syntax

In addition to Astro's default support for [GitHub Flavored Markdown](https://github.github.com/gfm/), several extra Markdown features are included:

- Admonitions ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#admonitions))
- GitHub repository cards ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards))
- Enhanced code blocks with Expressive Code ([Preview](https://fuwari.vercel.app/posts/expressive-code/) / [Docs](https://expressive-code.com/))

## ⚡ Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Installs dependencies                               |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`         |
| `pnpm build`               | Build your production site to `./dist/`             |
| `pnpm preview`             | Preview your build locally, before deploying        |
| `pnpm check`               | Run checks for errors in your code                  |
| `pnpm format`              | Format your code using Biome                        |
| `pnpm new-post <filename>` | Create a new post                                   |
| `pnpm astro ...`           | Run CLI commands like `astro add`, `astro check`    |
| `pnpm astro --help`        | Get help using the Astro CLI                        |

## ✏️ Contributing

Check out the [Contributing Guide](https://github.com/saicaca/fuwari/blob/main/CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)

## 🔐 Multi-Workspace Architecture

### Composite Post Document IDs

Posts are stored in Firestore with a composite document ID:

```
posts/{workspaceSlug}__{slug}
```

For example, a post with slug `my-first-post` owned by workspace `arturo` is stored as:

```
posts/arturo__my-first-post
```

This guarantees **strict per-workspace isolation**: slugs can repeat across workspaces without conflict, and every read/write targets the correct workspace document directly without requiring a Firestore collection scan.

Each post document includes the following required fields (in addition to content fields):

| Field         | Type   | Description                                                   |
|:--------------|:-------|:--------------------------------------------------------------|
| `workspaceId` | string | The `workspaceSlug` of the owning workspace (e.g. `arturo`)   |
| `ownerUid`    | string | Firebase Auth UID of the admin who created it                 |
| `slug`        | string | Human-readable slug (without workspace prefix)                |

### Required Firebase Custom Claims

Each admin user must have the following [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) set on their Firebase Auth account:

| Claim           | Type    | Description                                             |
|:----------------|:--------|:--------------------------------------------------------|
| `admin`         | boolean | Must be `true` to access any write API                  |
| `workspaceSlug` | string  | Identifies the workspace this admin owns (e.g. `arturo`)|

To set custom claims from a trusted server environment (e.g. Firebase Admin SDK):

```js
await getAuth().setCustomUserClaims(uid, {
  admin: true,
  workspaceSlug: "arturo",
});
```

### Session Authentication

The app uses **httpOnly cookies** for session management. After obtaining a Firebase ID token on the client, exchange it for a server-side session:

```js
await fetch("/api/auth/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idToken }),
});
```

This sets a `__session` cookie that is verified on every admin API call.

### Public Post Links

Once a workspace is marked `isPublic: true` in Firestore (`workspaces/{slug}`), its posts are accessible at:

```
/w/{workspaceSlug}/posts/{postSlug}
```

For example: `/w/arturo/posts/my-first-post`

The workspace about page is at `/w/{workspaceSlug}/about`.

### Navigation

| Route | Description |
|:------|:------------|
| `/` | Redirects to `/admin` (if logged in) or `/admin/login` |
| `/admin/login` | Google sign-in page for admins |
| `/admin` | Admin dashboard — lists the admin's own posts |
| `/admin/new` | Create a new post (admin only) |
| `/admin/edit/:slug` | Edit an existing post (admin only) |
| `/admin/workspace` | Configure workspace settings, profile, and about page |
| `/w/:slug` | Public read-only view of a workspace's posts |
| `/w/:slug/posts/:postSlug` | Public read-only view of an individual post |
| `/w/:slug/about` | Public about page for a workspace |

> **Legacy routes disabled:** `/posts/:slug` now redirects to `/404`. All posts are served exclusively under `/w/:workspaceSlug/posts/:postSlug`.

### Migration Safety

Posts created before composite IDs were introduced (without a `workspaceId` field) are no longer accessible via the old `/posts/{slug}` route (which now redirects to `/404`). New posts created through the admin interface use composite IDs (`workspaceSlug__slug`) and are served exclusively under their workspace route.

To migrate legacy posts, update each post document in Firestore to add the following fields:

```js
// Example: migrate a legacy post with slug "my-first-post" to workspace "arturo"
await firestore
  .collection("posts")
  .doc("arturo__my-first-post")  // new composite ID
  .set({
    ...existingPostData,
    workspaceId: "arturo",
    ownerUid: "<admin-uid>",
    slug: "my-first-post",
  });
// Then delete the old document: firestore.collection("posts").doc("my-first-post").delete()
```

After migration the post will be accessible at `/w/arturo/posts/my-first-post`.
