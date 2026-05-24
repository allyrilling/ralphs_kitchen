# SwiftUI CMS App — Plan

## Overview
A personal iOS app that creates posts for Ralph's Kitchen by writing markdown files to GitHub and uploading images to Cloudinary. No App Store needed — runs on your phone via Xcode.

---

## Screens

### 1. Settings (one-time setup)
- GitHub Personal Access Token (stored in Keychain)
- Cloudinary Cloud Name + Upload Preset (stored in Keychain)
- GitHub repo owner + repo name (hardcoded)

### 2. Home
- Two buttons: **Dinner Party** | **Out on the Town**
- List of recent posts (fetched from GitHub API)

### 3. New/Edit Post
- Collection (pre-selected from home)
- **Title** — text field
- **Date** — date picker (defaults to today)
- **Description** — optional text field
- **Image** — photo picker → uploads to Cloudinary → inserts URL into body
- **Body** — multiline text editor (markdown, simple)
- **Publish** button

---

## Data Flow

### Creating a post:
1. User fills form + picks photo
2. App uploads photo to Cloudinary → gets back URL
3. App constructs markdown file:
```
---
title: My Post
date: 2026-05-21
description: ""
---

![](https://res.cloudinary.com/...)

Body text here...
```
4. App base64-encodes the file content
5. App calls GitHub API:
   `PUT /repos/allyrilling/ralphs_kitchen/contents/content/dinner-party/{slug}/index.md`
6. Netlify auto-deploys → post is live

### Reading posts (list view):
- GitHub API `GET /repos/.../contents/content/dinner-party` to list files
- Fetch individual files to display

---

## Tech Stack
- **SwiftUI** — all UI
- **URLSession** — all API calls (no third-party networking)
- **Keychain** — store GitHub token + Cloudinary credentials securely
- **PhotosUI** — `PhotosPicker` for image selection
- **GitHub REST API** — read/write markdown files
- **Cloudinary REST API** — unsigned upload with existing upload preset

---

## File Structure
```
RalphsKitchenCMS/
├── App/
│   └── RalphsKitchenCMSApp.swift
├── Views/
│   ├── HomeView.swift
│   ├── PostFormView.swift
│   ├── PostListView.swift
│   └── SettingsView.swift
├── Services/
│   ├── GitHubService.swift        — API calls to GitHub
│   └── CloudinaryService.swift    — image upload
├── Models/
│   ├── Post.swift
│   └── Collection.swift
└── Utilities/
    └── KeychainHelper.swift
```

---

## Hardcoded Values (to keep it simple)
- Repo: `allyrilling/ralphs_kitchen`
- Branch: `main`
- Cloudinary cloud name: `dgdmgrse0`
- Upload preset: `ralphs kitchen`
- Collections: Dinner Party, Out on the Town

---

## Content Schema (matches existing Decap CMS config)

Both collections share the same fields:
| Field | Type | Required |
|---|---|---|
| title | string | yes |
| date | YYYY-MM-DD | yes |
| description | string | no |
| body | markdown | yes |

File path pattern: `content/{collection}/{slug}/index.md`

---

## Build & Run
- Requires Xcode + Apple Developer account (free tier is fine for personal use)
- Run directly on your iPhone via Xcode — no App Store submission needed
