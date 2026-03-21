📄 Blog Platform Spec (v2)

1. Overview

Build a minimal, fast, personal blog with a clean aesthetic and simple Markdown-based publishing workflow.

Primary goals:

• Zero/near-zero cost hosting

• Extremely simple publishing (Markdown-first)

• Clean, warm, typography-focused design

• Low maintenance, long-term stability

2. Tech Stack

Static Site Generator

• Hugo

• Markdown-based content

• Page bundle support for post organization

• Fast builds and minimal dependencies

Hosting

• GitHub Pages

• Automatic deploy on push

• No server/backend required

CMS (Optional, but include support)

• Decap CMS

• Accessible at /admin

• Git-backed content editing

• Media upload support

3. Content Structure

Use page bundles for all posts.

/content/posts/
/post-slug/
index.md
image-1.jpg
image-2.jpg
Post Format (Markdown frontmatter)

title: "Post Title"
date: 2026-03-20
description: "Short summary for SEO and previews"
tags: ["tag1", "tag2"] 4. Writing & Publishing Workflow

Primary workflow (required)

• Write posts in Markdown (index.md)

• Commit + push to repo

• Site auto-deploys via GitHub Pages

Optional CMS workflow

• Log into /admin

• Create/edit posts in UI via Decap CMS

• Media uploads handled automatically

5. Image Handling

Initial Implementation

• Store images within each post bundle

• Reference images relatively:

![Alt text](image-1.jpg)
Requirements

• Images should be:

• Automatically responsive

• Max width constrained to content width

• Lazy-loaded

Optimization (nice-to-have)

• Use Hugo image processing for resizing/compression where appropriate

6. URL Structure

• Posts:

/posts/<slug>/
• Clean URLs (no .html)

• Slugs derived from folder name

7. Design & UX

Visual direction

• Minimal and clean

• Strong typography focus

• Slight warmth/personal feel (not sterile)

Requirements

• Mobile-first responsive design

• Comfortable reading width (~65–75ch)

• Good spacing and readability

• Subtle visual personality (e.g. soft colors, gentle accents)

Features

• Dark mode (preferred, but optional if it complicates things)

8. Core Features

Required

• Blog index page (list of posts)

• Individual post pages

• Tags system:

• Tag pages (/tags/<tag>/)

• Tag links on posts

Search (lightweight)

• Client-side search (no backend)

• Options:

• Simple JS-based search (e.g. Fuse.js or Lunr.js)

• Index generated at build time

9. SEO & Built-ins

• Auto-generated:

• Sitemap

• RSS feed

• Per-post:

• Title

• Description

• Open Graph tags

10. Performance Requirements

• Minimal JavaScript

• No heavy frameworks

• Fast load times (<1s static load target)

• Optimized images (<500KB recommended)

11. Configuration for Future CDN (Important)

Prepare for easy migration to CDN (e.g. ImageKit or Cloudinary):

Requirement

• Abstract image base path via config

Example:

[params]
imageBase = ""
Templates should support:

{{ $src := printf "%s%s" .Site.Params.imageBase "image-1.jpg" }}
👉 This allows switching to CDN by changing one config value.

12. Deployment

• Push to main branch triggers deployment via GitHub Pages

• No manual deploy steps required

13. Out of Scope (for now)

• Comments

• Email/newsletter

• Complex backend features

🔥 Nice-to-Have (if easy)

• Reading time estimate per post

• Table of contents for long posts

• Image zoom/lightbox

• Syntax highlighting for code blocks

🧠 Final Notes for Developer

• Prioritize simplicity over flexibility

• Avoid over-engineering

• Prefer Hugo-native features over external dependencies

• Keep setup easy for a single-user workflow
