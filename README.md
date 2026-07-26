# NV Works — Website

Website for NV Works (Ambientenbeleuchtung &amp; Sternenhimmel). Static site, no server required — free to host on GitHub Pages, form submissions are emailed via Formspree.

## Folder structure

```
starlight-site/
├── index.html          → homepage
├── quote.html           → the quote request form customers fill out
├── css/
│   └── style.css        → all styling
├── js/
│   └── script.js         → starfield animation + form logic
├── images/
│   └── nv-works-logo.jpeg
└── README.md             → this file
```

Copy this whole folder into your GitHub repo exactly as-is (keep the same file/folder names — the pages link to `css/style.css`, `js/script.js`, and `images/nv-works-logo.jpeg` using these exact paths).

## Step 1 — Connect the form to Formspree (so submissions reach your friend's inbox)

1. Go to **formspree.io** and sign up for a free account (with the email your friend wants leads sent to).
2. Click **New Form**, give it a name like "NV Works Quote Requests," and create it.
3. Formspree will give you a form endpoint that looks like:
   `https://formspree.io/f/abcd1234`
4. Open `quote.html`, find this line near the top of the `<form>` tag:
   ```html
   <form id="quote-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
5. Replace `YOUR_FORM_ID` with the ID Formspree gave you (e.g. `abcd1234`).
6. Save the file.
7. Submit a test quote on the live site once it's deployed — Formspree will send a confirmation email the first time, and you need to click the verification link before it starts forwarding submissions.

That's it — every quote request (contact info, vehicle details, service selected, appointment preference, notes, and photo) lands in your friend's inbox automatically. The free Formspree plan covers 50 submissions/month, which is normally plenty to start; you can upgrade later if volume grows.

## Step 2 — Publish the site on GitHub Pages

1. Create a new repository on GitHub (e.g. `nv-works-site`).
2. Upload everything inside `starlight-site/` to the **root** of that repo (so `index.html` sits at the top level, not inside a subfolder).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. GitHub will give you a live URL after a minute or two, usually:
   `https://YOUR-USERNAME.github.io/nv-works-site/`
6. Share that link — or connect a custom domain later under the same Pages settings.

## Editing content later

- **Text/copy:** edit directly inside `index.html` / `quote.html` — it's plain HTML, readable top to bottom.
- **Colors/fonts:** all defined at the top of `css/style.css` under the `:root` block and the comment describing the palette.
- **Brand list / form fields:** the vehicle brand dropdown and service options live inside `quote.html`; add or remove `<option>` lines as needed.
- **Logo:** swap `images/nv-works-logo.jpeg` for a new file with the same name to update it everywhere.

## Notes

- No backend, database, or hosting cost beyond GitHub Pages (free) and Formspree (free tier).
- The photo upload field lets customers attach a picture of their car; Formspree includes file attachments in the notification email on paid plans — on the free plan the field still submits but attachments may be limited, so consider asking customers to email photos separately if that matters, or upgrading Formspree if volume justifies it.
- If you'd rather receive submissions in a different way (Google Sheet, Slack, etc.) later on, Formspree also supports Zapier/webhook integrations from the same dashboard — no code changes needed on this site.
