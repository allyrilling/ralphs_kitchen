# Ralph's Kitchen — TODO

## 1. Migrate from Decap CMS to Tina CMS
Goal: better mobile editing experience

Steps:
- [ ] Create TinaCloud account at tina.io and connect GitHub repo
- [x] Remove `static/admin/` (Decap config + index.html)
- [x] Created `package.json` + installed `@tinacms/cli`
- [x] Define collections in `tina/config.ts` (dinner-party, out-on-the-town) matching current Decap schema
- [ ] Add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` env vars to Netlify (get from TinaCloud dashboard)
- [ ] Test creating/editing a post from mobile
- [x] Update `netlify.toml` build command for Tina (`tinacms build && hugo --minify`)

Notes:
- Existing markdown content files don't change
- TinaCloud free tier: max 2 users
- Local dev: `npm run dev` (runs `tinacms dev -c "hugo server"`)
- Images: paste Cloudinary URLs directly in the body editor; no need for Decap's media widget
- TinaCloud setup steps: go to tina.io → New Project → connect GitHub repo → copy Client ID + Token → add to Netlify env vars

---

## 2. Mobile-friendly / responsive design
Goal: site looks and works well on phones

- [ ] Audit current CSS on mobile (check header nav, post layout, font sizes)
- [ ] Make header nav work on small screens (hamburger menu or stacked layout)
- [ ] Ensure post body text is readable on mobile (line length, font size)
- [ ] Check search page on mobile
- [ ] Test on real device after changes
