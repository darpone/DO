# Opérations Delta / Delta Operations

Static bilingual website for [www.deltaoperations.ca](https://www.deltaoperations.ca).

## Local preview

Serve the repository root with any static HTTP server. For example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`. Opening the HTML files directly is not recommended because the site uses root-relative URLs.

## Structure

- `/fr/` and `/en/`: localized pages
- `/assets/css/styles.css`: shared design system
- `/assets/js/main.js`: navigation and contact-form enhancement
- `/assets/js/tools.js`: browser-only interactive tools
- `CNAME`: GitHub Pages custom domain
- `sitemap.xml` and `robots.txt`: search discovery

There is no build step, backend, database, analytics, or tracking. See `README_REBUILD_PLAN.md` for implementation and deployment notes.
