# Specification

## Summary
**Goal:** Replace the existing logo with the newly uploaded Lit-Heaven logo across every location in the app where a logo appears.

**Planned changes:**
- Save the new logo (`lit-heaven-logo-new.dim_400x400.png`) as a static asset under `frontend/public/assets/generated/`
- Update the Navigation component to use the new logo on both desktop and mobile
- Update the favicon reference in `frontend/index.html` to point to the new logo
- Update the BooksPage hero banner to use the new logo
- Audit and update all remaining components (Footer, ProfileSetupModal, authentication pages, etc.) to replace any reference to the old logo (`lit-heaven-logo-visible.dim_400x400.png`) with the new one

**User-visible outcome:** The new Lit-Heaven open-book logo appears consistently in the navbar, favicon, hero banner, footer, and all other locations throughout the app, replacing the old logo everywhere.
