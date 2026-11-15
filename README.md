> **New:** ShareNet Client Android TV + ShareNet Receiver Windows are pre-listed. See `README_GITHUB_DARIJA.md` to configure GitHub Releases and GitHub Pages. The download buttons stay disabled until the repository is configured.

# ECAB STOR — Official app portfolio website

A premium, responsive, lightweight static website for the ECAB Android apps, with a ready-to-use Windows apps section and a local content editor. **No build step, no paid API, no framework.**

## Quick start

1. Unzip the folder.
2. Open `index.html` in Chrome, Firefox or Edge. The site works locally without a web server.
3. Open `studio.html` to add or edit Android / Windows app listings.
4. Click **تحميل apps-data.js** (Download apps-data.js) to export the updated catalog.
5. Replace the original `apps-data.js` file with the downloaded file.
6. Reload `index.html` to see the public site's updated listings.

**Important:** The editor is local-only and is NOT a secure online admin dashboard. It stores a draft in your browser and exports a file. Visitors to your published site cannot modify its real content. To publish changes, upload the updated `apps-data.js` to the host again. Do not describe `studio.html` as a password-protected admin panel.

## Real apps preconfigured

App | Package / official store destination
---|---
زاد الدعاء: أدعية وأذكار | `com.ecab.doaa`
Share Net with Proxy | `com.ecab.share.net`
Deleted Messages & Direct Chat | `com.faster.ecab`

Source: https://play.google.com/store/apps/developer?id=ecab&hl=en

**Note:** The third app has appeared under different titles in Google Play listings; the name on the supplied developer page was chosen. Edit it in `studio.html` if you prefer another display name. Descriptions are simplified summaries, not verbatim store copy.

Icons and app screenshots point to Google-hosted `play-lh.googleusercontent.com` images, which require internet access and may change over time. You can replace the icon/screenshot URLs with your own images in `assets/` for a fully self-hosted site.

## Publishing on GitHub Pages / Netlify / Cloudflare Pages

This is a static website. Upload **`index.html`, `styles.css`, `app.js`, `apps-data.js`, `favicon.svg`** to any static site host. Optional: `studio.html` and `studio.js` are local editing tools, and you can keep them off the public server. No PHP, Node.js or database is required. For permanent editing directly from the internet, a protected login and a backend/database are required.

## Add a Windows app

Open `studio.html`, click "زيد تطبيق جديد", choose **Windows**, enter the app name, description, icon URL, screenshots and your official HTTPS `.exe`/`.msi` release page download URL. Export `apps-data.js` and redeploy. Prefer signed Windows installers and trusted official hosting such as your own domain, GitHub Releases, or Microsoft Store.

## Features

- Premium dark/light themes, RTL Arabic and LTR English
- Verified Play Store links for 3 public ECAB listings
- App search, Android / Windows filters, app detail modal, screenshots
- Accessible basic keyboard controls, reduced-motion support, mobile layout
- Simple local content editor with import/export and safe URL validation
- External links open with `rel="noopener noreferrer"`

## Files

- `index.html` — public storefront
- `styles.css` — full responsive design system, also used by editor
- `app.js` — filtering, language, theme, dialog
- `apps-data.js` — editable app catalog (single source of truth)
- `studio.html` / `studio.js` — optional local app editor
- `favicon.svg` — ECAB STOR favicon

## Branding / contact

Website title: **ECAB STOR** (not ECAB STORE). The contact address currently matches the public developer support email on the referenced Google Play listings: `developerecab@gmail.com`. You can change it in `index.html`.

© ECAB STOR. Not affiliated with Google. App artwork is shown as part of the developer's catalog.
