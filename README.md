# DENTIN Oral Experts website

The website lives in `dist/`: `index.html`, `styles.css`, `script.js`, and `assets/`.
Edit those files to change the site. This is a static website; it does not require
Next.js, Vite, Cloudflare, or a database to run.

## Preview locally

```powershell
npm run dev
```

Open the URL printed in the terminal. The server starts at port 4173 and chooses
the next free port if it is already in use.

## Deploy to Netlify

`netlify.toml` runs `npm run build` and publishes `dist/`. The build checks that
the dental home page and its local images, stylesheet, and script are present.
Push changes to the Git branch connected to Netlify to deploy them.

The appointment form prepares a request that a visitor can send through their
email app; it does not submit to a booking backend.
