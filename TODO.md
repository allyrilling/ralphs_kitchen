# Ralph's Kitchen — TODO

## 1. Migrate from Decap CMS to Tina CMS
Goal: better mobile editing experience

Steps:
- [ ] Create TinaCloud account at tina.io and connect GitHub repo
- [ ] Remove `static/admin/` (Decap config + index.html)
- [ ] Run `npx @tinacms/cli init` in project root
- [ ] Define collections in `tina/config.ts` (dinner-party, out-on-the-town) matching current Decap schema
- [ ] Confirm Cloudinary image integration still works in Tina
- [ ] Test creating/editing a post from mobile
- [ ] Update `netlify.toml` build command if needed for Tina build step

Notes:
- Existing markdown content files don't need to change
- TinaCloud free tier: max 2 users
- Local dev: run `tinacms dev` alongside `hugo server`

---

## 2. Mobile-friendly / responsive design
Goal: site looks and works well on phones

- [ ] Audit current CSS on mobile (check header nav, post layout, font sizes)
- [ ] Make header nav work on small screens (hamburger menu or stacked layout)
- [ ] Ensure post body text is readable on mobile (line length, font size)
- [ ] Check search page on mobile
- [ ] Test on real device after changes
