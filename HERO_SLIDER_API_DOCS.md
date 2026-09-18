# 🎞️ Hero Slider — Backend API Specification

**Module:** Hero Slider (Homepage banner carousel)
**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary/S3
**Response convention:** Standard `ApiResponse` wrapper — `{ success, statusCode, data, message }` (see `BACKEND_ARCHITECTURE_AND_API_DOCS.md`).
**Base path:** `/api/v1`

This document specifies the API for the homepage **hero slider**: an ordered set of full-width slides, each with a background image, eyebrow badge, title (with a highlighted fragment), a description, and a set of "popular search" tags.

A global **`sharedMode`** flag controls whether the description and popular tags are:
- **the same for all slides** (`sharedMode: true`) — driven by a single `shared` block, or
- **different for each slide** (`sharedMode: false`) — each slide uses its own `description` and `tags`.

The **search bar itself is rendered by the website** and is **not** managed by this API. Only the images, text, and tags are managed here.

---

## 📑 Table of Contents

1. [Overview & Frontend Mapping](#1-overview--frontend-mapping)
2. [Data Model (Mongoose Schema)](#2-data-model-mongoose-schema)
3. [Endpoint Summary](#3-endpoint-summary)
4. [API Endpoints](#4-api-endpoints)
   - [4.1 GET /content/hero-slider](#41-get-contenthero-slider)
   - [4.2 PUT /content/hero-slider](#42-put-contenthero-slider)
5. [Media Upload](#5-media-upload)
6. [`sharedMode` Behavior](#6-sharedmode-behavior)
7. [Validation Rules](#7-validation-rules)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Standard Error Responses](#9-standard-error-responses)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Overview & Frontend Mapping

The admin page (`/admin/hero-slider`) manages a **single document** that holds:

| Admin control | Field | Public effect |
|---|---|---|
| "Same for all" / "Different for each slide" toggle | `sharedMode` | Whether `shared.*` or each slide's own `description`/`tags` is used |
| Shared description + tags (shown only in shared mode) | `shared.description`, `shared.tags[]` | Description + "Populaire" chips used on every slide |
| Slide background image | `slides[].image` | Full-bleed banner image |
| Eyebrow / badge | `slides[].eyebrow` | Pill above the title (e.g. "TOUR OPÉRATEUR SPÉCIALISÉ") |
| Title | `slides[].title` | Main heading |
| Highlighted title part | `slides[].titleHighlight` | Accent-colored fragment of the heading |
| Per-slide description | `slides[].description` | Used only when `sharedMode: false` |
| Per-slide popular tags | `slides[].tags[]` | Used only when `sharedMode: false` |
| Status | `slides[].status` | `Active` slides are shown; `Inactive` are hidden |
| Order (drag/reorder) | `slides[].order` | Display order |

Because the hero slider is a single ordered collection with a global flag, it is stored as **one document** (a singleton), edited and saved as a whole via `PUT`.

---

## 2. Data Model (Mongoose Schema)

```javascript
// src/models/HeroSlider.js
import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: '' },        // badge text
    title: { type: String, trim: true, required: true },       // main heading
    titleHighlight: { type: String, trim: true, default: '' }, // accent-colored fragment
    image: { type: String, trim: true, default: '' },          // Cloudinary URL
    description: { type: String, trim: true, default: '' },     // used when sharedMode = false
    tags: { type: [String], default: [] },                     // used when sharedMode = false
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const HeroSliderSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'hero-slider', unique: true, index: true },

    // Global flag: true = one description/tags for all slides
    sharedMode: { type: Boolean, default: true },

    // Used for every slide when sharedMode = true
    shared: {
      description: { type: String, trim: true, default: '' },
      tags: { type: [String], default: [] },
    },

    slides: { type: [SlideSchema], default: [] },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('HeroSlider', HeroSliderSchema);
```

> **Singleton:** keep exactly one document keyed by `key: "hero-slider"`, upserted on write.
> **Client ids:** the admin UI assigns each slide a temporary `id` (e.g. `slide-1699...`) for React keys only. The backend may ignore/strip it; slide identity is positional (`order`).

---

## 3. Endpoint Summary

| # | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| 4.1 | `GET` | `/content/hero-slider` | Public | Fetch the slider (flag + shared block + slides) |
| 4.2 | `PUT` | `/content/hero-slider` | Admin / Super Admin | Replace/upsert the whole slider document |

---

## 4. API Endpoints

### 4.1 `GET /content/hero-slider`

- **Access:** Public
- **Description:** Returns the hero slider document used to render the homepage. If none exists, return a default (empty `slides: []`) document rather than 404.
- **Query params:** none. (Public consumers may filter `status === "Active"` client-side, or the backend may expose an `?activeOnly=true` option — optional.)
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Hero slider fetched successfully",
  "data": {
    "sharedMode": true,
    "shared": {
      "description": "Spécialiste des voyages authentiques et sur mesure au Rajasthan, en Inde du Nord, Inde du Sud et au Népal.",
      "tags": ["Rajasthan", "Taj Mahal", "Népal", "Sur Mesure"]
    },
    "slides": [
      {
        "eyebrow": "TOUR OPÉRATEUR SPÉCIALISÉ",
        "title": "Jodhpur Voyage",
        "titleHighlight": "Inde & Népal",
        "image": "https://res.cloudinary.com/jv/image/upload/v1/hero/tigers.webp",
        "description": "",
        "tags": [],
        "status": "Active",
        "order": 1
      },
      {
        "eyebrow": "MERVEILLES D’INDE",
        "title": "Voyages Émotion &",
        "titleHighlight": "Patrimoine",
        "image": "https://res.cloudinary.com/jv/image/upload/v1/hero/fort.webp",
        "description": "",
        "tags": [],
        "status": "Active",
        "order": 2
      },
      {
        "eyebrow": "AVENTURE & SPIRITUALITÉ",
        "title": "Des Sommets",
        "titleHighlight": "du Népal",
        "image": "https://res.cloudinary.com/jv/image/upload/v1/hero/nepal.webp",
        "description": "",
        "tags": [],
        "status": "Active",
        "order": 3
      }
    ],
    "updatedAt": "2026-09-18T11:05:00.000Z"
  }
}
```

> When `sharedMode` is `true`, per-slide `description`/`tags` may be empty — clients should fall back to `shared.description` / `shared.tags`. See [`sharedMode` Behavior](#6-sharedmode-behavior).

- **Caching:** safe to cache/CDN with a short TTL; bust cache on `PUT`.

---

### 4.2 `PUT /content/hero-slider`

- **Access:** Admin / Super Admin (JWT + RBAC)
- **Description:** Replaces (upserts) the whole slider document. The admin sends the full object from the editor. Slides are stored in the given array order.
- **Headers:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body:**

```json
{
  "sharedMode": false,
  "shared": {
    "description": "Spécialiste des voyages authentiques et sur mesure...",
    "tags": ["Rajasthan", "Taj Mahal", "Népal", "Sur Mesure"]
  },
  "slides": [
    {
      "eyebrow": "TOUR OPÉRATEUR SPÉCIALISÉ",
      "title": "Jodhpur Voyage",
      "titleHighlight": "Inde & Népal",
      "image": "https://res.cloudinary.com/jv/image/upload/v1/hero/tigers.webp",
      "description": "Spécialiste des voyages authentiques et sur mesure au Rajasthan...",
      "tags": ["Rajasthan", "Taj Mahal", "Népal"],
      "status": "Active",
      "order": 1
    },
    {
      "eyebrow": "AVENTURE & SPIRITUALITÉ",
      "title": "Des Sommets",
      "titleHighlight": "du Népal",
      "image": "https://res.cloudinary.com/jv/image/upload/v1/hero/nepal.webp",
      "description": "Des vallées sacrées de Katmandou aux sommets mythiques de l’Himalaya...",
      "tags": ["Népal", "Sur Mesure"],
      "status": "Active",
      "order": 2
    }
  ]
}
```

- **Success Response (200 OK):** returns the saved document (same shape as 4.1 `data`).

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Hero slider updated successfully",
  "data": { "sharedMode": false, "shared": { "...": "..." }, "slides": [ /* ... */ ], "updatedAt": "2026-09-18T11:10:00.000Z" }
}
```

- **Behavior notes:**
  - Upsert by `key: "hero-slider"` — never create duplicates.
  - Persist `slides` in the array order received; you may normalize `order` to `index + 1`.
  - Set `updatedBy` from the authenticated user; bump `updatedAt`.
  - Do **not** discard per-slide `description`/`tags` when `sharedMode` is `true` — keep them stored so switching back to per-slide mode preserves earlier values. (The admin keeps them in state; the backend should just store what it receives.)

---

## 5. Media Upload

Slide background images are uploaded **separately** via the existing upload endpoint; only the returned **URL string** is stored in `slides[].image`.

- **Endpoint:** `POST /upload/single` — `multipart/form-data`, field name `image`.
- **Access:** Admin / Editor
- **Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/jv/image/upload/v1/hero/tigers.webp",
    "public_id": "hero/tigers",
    "format": "webp",
    "bytes": 412330
  }
}
```

**Frontend flow:** the admin `ImageUploader` calls `/upload/single`, receives `data.url`, and stores that URL in the slide. When the slider is saved (4.2), only URLs travel in the JSON body — no binary data.

**Recommended image size:** ~1920×900 (wide banner), optimized to WebP.

---

## 6. `sharedMode` Behavior

The public renderer resolves the description/tags for each slide as follows:

```txt
if sharedMode == true:
    description = shared.description
    tags        = shared.tags
else:
    description = slide.description
    tags        = slide.tags
```

- **`sharedMode: true`** — Admin edits one description + one tag list in the "Same for all slides" panel; every slide shows them. Per-slide `description`/`tags` are ignored for rendering (but retained in storage).
- **`sharedMode: false`** — Each slide's own `description` and `tags` are used; the shared block is ignored for rendering (but retained).

This lets the admin flip between modes without losing either the shared values or the per-slide values.

---

## 7. Validation Rules

**`PUT /content/hero-slider`:**

| Field | Rule |
|---|---|
| `sharedMode` | boolean (default `true`) |
| `shared.description` | string, max 600 chars, trimmed |
| `shared.tags` | array of strings; each 1–40 chars; max 12 tags; de-duplicate case-insensitively |
| `slides` | array; max ~12 slides |
| `slides[].title` | **required**, string, 1–120 chars |
| `slides[].eyebrow` | optional, string, max 80 chars |
| `slides[].titleHighlight` | optional, string, max 80 chars |
| `slides[].image` | optional, valid `http(s)` URL if non-empty |
| `slides[].description` | optional, string, max 600 chars |
| `slides[].tags` | array of strings; each 1–40 chars; max 12 tags |
| `slides[].status` | enum `Active` \| `Inactive` |
| `slides[].order` | integer ≥ 0 |

- Trim all strings; drop empty tags.
- No HTML is expected in slider fields — store as **plain text** (escape on render). If you accept HTML, sanitize it.

---

## 8. Authentication & Authorization

- **Public (no auth):** `GET /content/hero-slider`.
- **Protected (JWT `Authorization: Bearer <accessToken>` + RBAC):** `PUT /content/hero-slider`.
- **Roles allowed for writes:** `admin`, `super-admin` (align with `src/constants/roles.js`).
- Record `updatedBy = req.user._id` on write.

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
    { "field": "slides[0].title", "message": "title is required" },
    { "field": "shared.tags", "message": "maximum 12 tags allowed" }
  ]
}
```

---

## 10. Implementation Notes

1. **Singleton document:** store the slider in one document keyed by `key: "hero-slider"`. On `GET`, use `findOneAndUpdate({ key }, { $setOnInsert: { slides: [], sharedMode: true, shared: { description: '', tags: [] } } }, { upsert: true, new: true })` so a document always exists.
2. **Whole-document save:** the admin sends the full object on `PUT`; replace `sharedMode`, `shared`, and `slides` atomically.
3. **Preserve both content sets:** store per-slide `description`/`tags` even when `sharedMode` is `true`, and vice-versa, so toggling modes is lossless.
4. **Ordering:** persist slides in received order; normalize `order` to `index + 1` for stability.
5. **Search bar:** intentionally out of scope — the website renders search itself; only the "popular" tags feed into that UI.
6. **Frontend contract:** the frontend already calls `GET/PUT /content/hero-slider` via `heroSliderApi`. Implementing these endpoints exactly as specified requires **no frontend changes** — the admin's "Saved locally" badge flips to "Synced" once the endpoints are live.
7. **Routes wiring:** add the route to the existing `content.routes.js` (or a new `heroSlider.routes.js`) and mount it in `src/routes/index.js`.

---

### Suggested backend file additions

```plaintext
src/
├── models/
│   └── HeroSlider.js                # new singleton model
├── controllers/
│   └── heroSlider.controller.js     # getSlider, updateSlider
├── routes/
│   └── content.routes.js            # add GET/PUT /content/hero-slider
└── validations/
    └── heroSlider.validation.js
```
