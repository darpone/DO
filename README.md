# Opérations Delta / Delta Operations — Coming Soon

This folder is ready to upload to a GitHub repository and publish with GitHub Pages.

## Included files

- `index.html` — bilingual coming-soon page
- `delta-operations-logo.png` — cropped version of the supplied logo
- `favicon.png` — browser icon
- `privacy.html` — starter bilingual privacy notice
- `CNAME` — primary custom domain

## Publish on GitHub Pages

1. Create a public GitHub repository.
2. Upload every file in this folder to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save and wait for GitHub to publish the site.
7. In the Pages settings, set the custom domain to `www.deltaoperations.ca`.
8. Configure the domain's DNS records at the registrar.
9. Enable **Enforce HTTPS** when GitHub makes it available.

The `CNAME` file is included, but the custom domain must still be configured in
the repository's Pages settings.

## Lead form

The form is connected to Formspree form ID `xzdnzlnr`.

It submits with plain browser JavaScript using `fetch`, so the visitor remains
on the page and sees a bilingual success or error message. No React, npm package,
server, or build step is required.

## Before publishing

Search `index.html` and `privacy.html` for:

`contact@operationsdelta.ca`

Replace it if that mailbox is not active yet.

The privacy page is a practical starter template, not legal advice. Review and
adapt it before collecting real leads.


## Positioning

The page presents Delta Operations as a broad small-business technology and
operations partner: AI consulting, problem solving, automation, tool integration,
and custom systems. It is intentionally not positioned as an Excel-cleanup service.
