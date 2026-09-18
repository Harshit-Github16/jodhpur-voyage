# 🧭 "Who We Are" Section — Backend API Specification

**Module:** Who We Are (Company / About area)
**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary/S3
**Response convention:** Standard `ApiResponse` wrapper — `{ success, statusCode, data, message }` (see the main `BACKEND_ARCHITECTURE_AND_API_DOCS.md`).
**Base path:** `/api/v1`

This document specifies every API needed to power the entire "Who We Are" section of the website and its admin content manager. The section is made of two distinct concerns:

1. **Page Content** — CMS-style editable content (company overview, landing hub cards, the "Who Are We" page, and the team-page header). This is a single JSON document persisted under one resource.
2. **Team Experts** — a collection of individual expert profiles shown on the "Our Team" page (already backed by the existing `/team` endpoints; documented here for completeness).

> Reviews & Testimonials for this area are served by the existing **Commentaires** module (`/commentaires`) and are intentionally **out of scope** here.

---

## 📑 Table of Contents

1. [Overview & Frontend Mapping](#1-overview--frontend-mapping)
2. [Data Models (Mongoose Schemas)](#2-data-models-mongoose-schemas)
3. [Endpoint Summary](#3-endpoint-summary)
4. [Module A — Who We Are Page Content APIs](#4-module-a--who-we-are-page-content-apis)
   - [A.1 GET /content/who-we-are](#a1-get-contentwho-we-are)
   - [A.2 PUT /content/who-we-are](#a2-put-contentwho-we-are)
   - [A.3 PATCH /content/who-we-are/:section](#a3-patch-contentwho-we-aresection-optional)
5. [Module B — Team Experts APIs](#5-module-b--team-experts-apis)
   - [B.1 GET /team](#b1-get-team-public)
   - [B.2 GET /team/admin](#b2-get-teamadmin)
   - [B.3 POST /team](#b3-post-team)
   - [B.4 PUT /team/:id](#b4-put-teamid)
   - [B.5 DELETE /team/:id](#b5-delete-teamid)
6. [Media Upload](#6-media-upload)
7. [Validation Rules](#7-validation-rules)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Standard Error Responses](#9-standard-error-responses)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Overview & Frontend Mapping

The admin content manager (`/admin/who-we-are`) is organized into tabs. Each tab maps to a section of the page-content document:

| Admin Tab | Content key | Public location |
|---|---|---|
| Company Overview | `overview` | Top "what is the company / what we do" block (rich text) |
| Landing Cards | `landing` | The 5-card hub strip ("Who are we", "Our added value", "Our responsible commitment", "Our Team", "Reviews & Testimonials") |
| Who Are We Page | `whoAreWe` | Hero + Identity (rich text + image) + Founder/Philosophy + Commitment pillars |
| Our Team | `teamPage` + **Team Experts** | Team page hero + intro block, then the expert cards |
| Reviews & Testimonials | — | Handled by the Commentaires module |

- **Page content** (`overview`, `landing`, `whoAreWe`, `teamPage`) is a **single document** → Module A.
- **Experts** are a **collection** → Module B (`/team`).

All rich-text fields (`overview.body`, `whoAreWe.identity.body`, `whoAreWe.founder.body`, `teamPage.intro.body`) contain **sanitized HTML** produced by the admin rich-text editor. The backend MUST sanitize this HTML on write (see [Validation Rules](#7-validation-rules)).

---

## 2. Data Models (Mongoose Schemas)

### 2.1 `WhoWeAreContent` (single document / singleton)

Only one document should exist. Recommended pattern: a fixed `key: "who-we-are"` unique field, upserted on write.

```javascript
// src/models/WhoWeAreContent.js
import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    image: { type: String, trim: true, default: '' },   // Cloudinary URL
    link: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    text: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const WhoWeAreContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'who-we-are', unique: true, index: true },

    // Tab 1 — Company Overview
    overview: {
      eyebrow: { type: String, trim: true, default: '' },
      title: { type: String, trim: true, default: '' },
      body: { type: String, default: '' },              // sanitized HTML
      image: { type: String, trim: true, default: '' },
    },

    // Tab 2 — Landing hub (5-card strip)
    landing: {
      heading: { type: String, trim: true, default: '' },
      cards: { type: [CardSchema], default: [] },
    },

    // Tab 3 — "Who Are We" page
    whoAreWe: {
      hero: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        subtitle: { type: String, trim: true, default: '' },
        backgroundImage: { type: String, trim: true, default: '' },
      },
      identity: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        body: { type: String, default: '' },            // sanitized HTML
        image: { type: String, trim: true, default: '' },
      },
      founder: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        name: { type: String, trim: true, default: '' },
        role: { type: String, trim: true, default: '' },
        photo: { type: String, trim: true, default: '' },
        quote: { type: String, default: '' },
        body: { type: String, default: '' },            // sanitized HTML
      },
      pillars: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        subtitle: { type: String, trim: true, default: '' },
        items: { type: [ItemSchema], default: [] },
      },
    },

    // Tab 4 — "Our Team" page header (experts come from the Team collection)
    teamPage: {
      hero: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        subtitle: { type: String, trim: true, default: '' },
        backgroundImage: { type: String, trim: true, default: '' },
      },
      intro: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        body: { type: String, default: '' },            // sanitized HTML
        highlights: { type: [ItemSchema], default: [] }, // { title, text }
      },
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('WhoWeAreContent', WhoWeAreContentSchema);
```

> **Note on `_id` for array items:** The admin UI generates client-side ids (e.g. `card-1699...`) for React keys only. The backend should NOT rely on those. Either strip them and use array index/order, or store your own `_id`. The examples below keep a client `id` field for convenience; treat it as optional/opaque.

### 2.2 `TeamMember` (collection) — the experts

```javascript
// src/models/Team.js  (extend the existing model with `expertise` and `order`)
import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    role: { type: String, trim: true, required: true },   // e.g. "North India & Himalayan Travel Expert"
    expertise: { type: String, trim: true, default: '' },  // grey subtitle line, e.g. "Rajasthan, Banaras, Ladakh, Spiti"
    bio: { type: String, default: '' },
    image: { type: String, trim: true, default: '' },      // Cloudinary URL
    experienceYears: { type: Number, min: 0, default: 0 },
    order: { type: Number, default: 0, index: true },      // display order
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', TeamMemberSchema);
```

> `expertise` and `order` are **new fields** the "Who We Are" UI relies on. If the existing `Team` model doesn't have them yet, add them (both are optional and backward-compatible).

---

## 3. Endpoint Summary

| # | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| A.1 | `GET` | `/content/who-we-are` | Public | Fetch the full page-content document |
| A.2 | `PUT` | `/content/who-we-are` | Admin / Super Admin | Replace/upsert the full page-content document |
| A.3 | `PATCH` | `/content/who-we-are/:section` | Admin / Super Admin | Update a single section (optional convenience) |
| B.1 | `GET` | `/team` | Public | List active experts (for the website) |
| B.2 | `GET` | `/team/admin` | Admin / Super Admin | List all experts incl. inactive (for admin) |
| B.3 | `POST` | `/team` | Admin / Super Admin | Create an expert |
| B.4 | `PUT` | `/team/:id` | Admin / Super Admin | Update an expert |
| B.5 | `DELETE` | `/team/:id` | Admin / Super Admin | Delete an expert |

---

## 4. Module A — Who We Are Page Content APIs

The page content is a **singleton document**. `GET` returns it (creating defaults if none exists), `PUT` upserts it.

### A.1 `GET /content/who-we-are`

- **Access:** Public
- **Description:** Returns the full "Who We Are" content document used to render the public pages. If no document exists yet, the backend should return a default (empty-ish) document rather than 404.
- **Query params:** none
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Who We Are content fetched successfully",
  "data": {
    "overview": {
      "eyebrow": "ABOUT JODHPUR VOYAGE",
      "title": "Who We Are & What We Do",
      "body": "<p><strong>Jodhpur Voyage</strong> is a local, French-speaking travel agency based in Rajasthan, India...</p>",
      "image": "https://res.cloudinary.com/jv/image/upload/v1/who-we-are/overview.webp"
    },
    "landing": {
      "heading": "CREATOR OF THE MOST BEAUTIFUL JOURNEYS FOR 20+ YEARS",
      "cards": [
        { "id": "card-who", "title": "Who are we", "image": "https://.../who.webp", "link": "/who-we-are" },
        { "id": "card-value", "title": "Our added value", "image": "https://.../value.webp", "link": "/who-we-are#added-value" },
        { "id": "card-commitment", "title": "Our responsible commitment", "image": "https://.../commitment.webp", "link": "/who-we-are#commitment" },
        { "id": "card-team", "title": "Our Team", "image": "https://.../team.webp", "link": "/who-we-are/team" },
        { "id": "card-reviews", "title": "Reviews & Testimonials", "image": "https://.../reviews.webp", "link": "/commentaires" }
      ]
    },
    "whoAreWe": {
      "hero": {
        "eyebrow": "OUR HISTORY & OUR COMMITMENTS",
        "title": "Who are we ?",
        "subtitle": "A local, French-speaking travel agency in India and Nepal...",
        "backgroundImage": "https://.../who-we-are/hero.webp"
      },
      "identity": {
        "eyebrow": "OUR IDENTITY",
        "title": "A Passionate, French-Speaking Local Agency",
        "body": "<p><strong>Jodhpur Voyage</strong> is a local travel agency based in Rajasthan...</p>",
        "image": "https://.../who-we-are/identity.webp"
      },
      "founder": {
        "eyebrow": "A WORD FROM THE FOUNDER",
        "title": "Our Philosophy",
        "name": "Mr Singh",
        "role": "Founder & Main Contact Person",
        "photo": "https://.../who-we-are/founder.webp",
        "quote": "Passionate about my country and its culture...",
        "body": "<p>The project was born from a desire to open ourselves to the world...</p>"
      },
      "pillars": {
        "eyebrow": "WHY CHOOSE US",
        "title": "The Pillars of Our Commitment",
        "subtitle": "Exceptional service for a worry-free journey.",
        "items": [
          { "id": "pillar-1", "title": "Direct & Without Intermediaries", "text": "We offer direct, negotiated prices..." },
          { "id": "pillar-2", "title": "Charming Accommodations & Havelis", "text": "We recommend the havelis..." }
        ]
      }
    },
    "teamPage": {
      "hero": {
        "eyebrow": "LOCAL FRENCH-SPEAKING EXPERTS",
        "title": "The Jodhpur Travel Team:",
        "subtitle": "A passionate team living and working in India...",
        "backgroundImage": "https://.../team/hero.webp"
      },
      "intro": {
        "eyebrow": "JODHPUR TRAVEL WHVING LIFE LTD",
        "title": "The Jodhpur Travel Team – Our local team",
        "body": "<p>We are proud to have more than 6 travel experts...</p>",
        "highlights": [
          { "id": "hl-1", "title": "+6 Experts on site", "text": "Living & working in India" },
          { "id": "hl-2", "title": "Certified Guides", "text": "Approved by the Ministry of Tourism" },
          { "id": "hl-3", "title": "Customized Service", "text": "Advice & \"Personal Touch\"" }
        ]
      }
    },
    "updatedAt": "2026-09-18T10:15:00.000Z"
  }
}
```

- **Caching:** Safe to cache/CDN. Recommend `Cache-Control: public, max-age=60` and cache-busting on `PUT`.

---

### A.2 `PUT /content/who-we-are`

- **Access:** Admin / Super Admin (JWT + RBAC)
- **Description:** Replaces (upserts) the full content document. The admin sends the complete `content` object from the editor. The backend should upsert the singleton and return the saved document.
- **Headers:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body:** The full content object (same shape as `data` in A.1). Partial bodies are also acceptable if you deep-merge server-side, but the admin always sends the full object.

```json
{
  "overview": {
    "eyebrow": "ABOUT JODHPUR VOYAGE",
    "title": "Who We Are & What We Do",
    "body": "<p>...sanitized HTML...</p>",
    "image": ""
  },
  "landing": {
    "heading": "CREATOR OF THE MOST BEAUTIFUL JOURNEYS FOR 20+ YEARS",
    "cards": [
      { "title": "Who are we", "image": "", "link": "/who-we-are" }
    ]
  },
  "whoAreWe": {
    "hero": { "eyebrow": "", "title": "Who are we ?", "subtitle": "", "backgroundImage": "" },
    "identity": { "eyebrow": "OUR IDENTITY", "title": "...", "body": "<p>...</p>", "image": "" },
    "founder": { "eyebrow": "", "title": "Our Philosophy", "name": "Mr Singh", "role": "Founder", "photo": "", "quote": "...", "body": "<p>...</p>" },
    "pillars": { "eyebrow": "WHY CHOOSE US", "title": "...", "subtitle": "...", "items": [ { "title": "...", "text": "..." } ] }
  },
  "teamPage": {
    "hero": { "eyebrow": "", "title": "The Jodhpur Travel Team:", "subtitle": "", "backgroundImage": "" },
    "intro": { "eyebrow": "", "title": "...", "body": "<p>...</p>", "highlights": [ { "title": "+6 Experts on site", "text": "Living & working in India" } ] }
  }
}
```

- **Success Response (200 OK):** Returns the saved document (same shape as A.1 `data`).

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Who We Are content updated successfully",
  "data": { "overview": { "...": "..." }, "landing": { "...": "..." }, "whoAreWe": { "...": "..." }, "teamPage": { "...": "..." }, "updatedAt": "2026-09-18T10:20:00.000Z" }
}
```

- **Behavior notes:**
  - Upsert by `key: "who-we-are"` — never create duplicates.
  - Sanitize all HTML body fields before saving.
  - Set `updatedBy` from the authenticated user; bump `updatedAt`.
  - Strip client-only `id` fields from array items if you don't persist them.

---

### A.3 `PATCH /content/who-we-are/:section` (optional)

A convenience endpoint to update a single tab without sending the whole document. Optional — the admin currently uses `PUT` with the full object, so this can be skipped in v1.

- **Access:** Admin / Super Admin
- **Path param:** `section` ∈ `overview` | `landing` | `whoAreWe` | `teamPage`
- **Request Body:** The object for that section only.

```
PATCH /content/who-we-are/overview
{
  "eyebrow": "ABOUT JODHPUR VOYAGE",
  "title": "Who We Are & What We Do",
  "body": "<p>...</p>",
  "image": ""
}
```

- **Success Response (200 OK):** Returns the full updated document (A.1 shape).
- **Errors:** `400` if `:section` is not one of the allowed keys.

---

## 5. Module B — Team Experts APIs

These power the expert cards on the "Our Team" page and the experts manager in the admin. They map to the existing `/team` routes; the only additions are the `expertise` and `order` fields.

### B.1 `GET /team` (Public)

- **Access:** Public
- **Description:** Returns **active** experts, sorted by `order` ascending (then `createdAt`).
- **Query params (optional):** `sort` (default `order`), `limit`.
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team fetched successfully",
  "data": [
    {
      "id": "66f0a1b2c3d4e5f60718293a",
      "name": "Vikey",
      "role": "North India & Himalayan Travel Expert",
      "expertise": "Rajasthan, Banaras, Ladakh, Spiti",
      "bio": "Namasté, I am Vikey, a certified French-speaking guide originally from Rajasthan...",
      "image": "https://res.cloudinary.com/jv/image/upload/v1/team/vikey.webp",
      "experienceYears": 17,
      "order": 1,
      "status": "Active"
    }
  ]
}
```

### B.2 `GET /team/admin`

- **Access:** Admin / Super Admin
- **Description:** Returns **all** experts including `Inactive`, sorted by `order`. Used by the admin experts manager.
- **Success Response (200 OK):** Same item shape as B.1, including inactive entries.

### B.3 `POST /team`

- **Access:** Admin / Super Admin
- **Headers:** `Authorization: Bearer <accessToken>`
- **Request Body:**

```json
{
  "name": "Praveen",
  "role": "North & South India Travel Expert",
  "expertise": "Rajasthan, North & South India",
  "bio": "My name is Praveen, a qualified French-speaking guide...",
  "image": "https://res.cloudinary.com/jv/image/upload/v1/team/praveen.webp",
  "experienceYears": 12,
  "order": 2,
  "status": "Active"
}
```

- **Required:** `name`, `role`. **Optional:** `expertise`, `bio`, `image`, `experienceYears`, `order`, `status`.
- **Success Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Team member created successfully",
  "data": { "id": "66f0a2...", "name": "Praveen", "role": "North & South India Travel Expert", "expertise": "Rajasthan, North & South India", "bio": "...", "image": "...", "experienceYears": 12, "order": 2, "status": "Active" }
}
```

### B.4 `PUT /team/:id`

- **Access:** Admin / Super Admin
- **Path param:** `id` — the expert's MongoDB `_id`.
- **Request Body:** Any subset of the fields in B.3 (partial update).
- **Success Response (200 OK):** Returns the updated expert.
- **Errors:** `404` if the id doesn't exist.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team member updated successfully",
  "data": { "id": "66f0a2...", "name": "Praveen", "role": "Senior Travel Expert", "status": "Active" }
}
```

### B.5 `DELETE /team/:id`

- **Access:** Admin / Super Admin
- **Path param:** `id`
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team member deleted successfully",
  "data": { "id": "66f0a2..." }
}
```

- **Errors:** `404` if not found.

---

## 6. Media Upload

All images (`overview.image`, card images, hero backgrounds, `identity.image`, `founder.photo`, expert `image`) are uploaded **separately** via the existing upload endpoint, and only the returned **URL string** is stored in the content/expert documents.

- **Endpoint:** `POST /upload/single` — `multipart/form-data`, field name `image`.
- **Access:** Admin / Editor
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/jv/image/upload/v1/who-we-are/founder.webp",
    "public_id": "who-we-are/founder",
    "format": "webp",
    "bytes": 148213
  }
}
```

**Frontend flow:** the admin `ImageUploader` calls `/upload/single`, receives `data.url`, and puts that URL into the relevant content field. When the content is saved (A.2), only URLs travel in the JSON body — no binary data.

---

## 7. Validation Rules

**Page content (`PUT /content/who-we-are`):**

| Field | Rule |
|---|---|
| `overview.title`, `overview.eyebrow` | string, max 200 chars, trimmed |
| `overview.body`, `*.body` (all rich text) | string, **HTML-sanitized** server-side; max ~50,000 chars |
| `*.image`, `*.photo`, `*.backgroundImage` | string; if non-empty, must be a valid `http(s)` URL |
| `landing.cards` | array; each: `title` required (max 120), `image` valid URL or empty, `link` string (max 300) |
| `whoAreWe.pillars.items` | array; each: `title` (max 160), `text` (max 600) |
| `teamPage.intro.highlights` | array; each: `title` (max 120), `text` (max 200) |

**Experts (`POST`/`PUT /team`):**

| Field | Rule |
|---|---|
| `name` | required, string, 2–120 chars |
| `role` | required, string, 2–200 chars |
| `expertise` | optional, string, max 200 chars |
| `bio` | optional, string, max 3000 chars |
| `image` | optional, valid `http(s)` URL |
| `experienceYears` | optional, integer ≥ 0 |
| `order` | optional, integer ≥ 0 |
| `status` | optional, enum `Active` \| `Inactive` |

**HTML sanitization:** Use a library like `sanitize-html`. Allow a safe subset: `p, br, strong, b, em, i, u, s, h1–h4, ul, ol, li, blockquote, hr, a[href], span[style], img[src,alt]`, and inline `color`/`background-color` styles. Strip `<script>`, event handlers, and `javascript:` URLs.

---

## 8. Authentication & Authorization

- **Public (no auth):** `GET /content/who-we-are`, `GET /team`.
- **Protected (JWT `Authorization: Bearer <accessToken>` + RBAC):** all write endpoints (`PUT/PATCH /content/who-we-are`, `POST/PUT/DELETE /team`) and `GET /team/admin`.
- **Roles allowed for writes:** `admin`, `super-admin` (align with the roles in `src/constants/roles.js`).
- Content writes should record `updatedBy = req.user._id`.

---

## 9. Standard Error Responses

All errors use the standard `ApiError` wrapper.

**401 Unauthorized**
```json
{ "success": false, "statusCode": 401, "message": "Unauthorized: access token missing or invalid", "errors": [] }
```

**403 Forbidden**
```json
{ "success": false, "statusCode": 403, "message": "Forbidden: insufficient role", "errors": [] }
```

**400 Validation Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "name is required" },
    { "field": "landing.cards[0].title", "message": "title is required" }
  ]
}
```

**404 Not Found**
```json
{ "success": false, "statusCode": 404, "message": "Team member not found", "errors": [] }
```

---

## 10. Implementation Notes

1. **Singleton document:** Keep the content in one document keyed by `key: "who-we-are"`. On `GET`, `findOneAndUpdate({ key }, { $setOnInsert: defaults }, { upsert: true, new: true })` guarantees a document always exists.
2. **Backward compatibility:** Add `expertise` and `order` to the existing `Team` model — both optional; existing docs default to `''` / `0`.
3. **Ordering:** Sort experts by `order` asc, then `createdAt` asc, for a stable public display order.
4. **Sanitize on write, trust on read:** Sanitize HTML in the controller before saving; the frontend renders stored HTML as-is.
5. **Client ids are opaque:** Array item `id` fields from the UI are for React keys; the backend may strip or ignore them.
6. **Frontend contract:** The frontend already calls `GET/PUT /content/who-we-are` (via `whoWeAreContentApi`) and `/team` (via `teamApi`). Implementing these endpoints exactly as specified requires **no frontend changes** — the admin's "Saved locally" badge automatically flips to "Synced" once the endpoints are live.
7. **Routes wiring:** add `content.routes.js` (mounts `/content/who-we-are`) to `src/routes/index.js`; extend `team.routes.js` if new fields require validation updates.

---

### Suggested backend file additions

```plaintext
src/
├── models/
│   └── WhoWeAreContent.js          # new singleton model
├── controllers/
│   └── whoWeAreContent.controller.js  # getContent, updateContent, patchSection
├── routes/
│   └── content.routes.js           # /content/who-we-are
└── validations/
    └── whoWeAreContent.validation.js
```
