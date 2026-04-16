# Travel Pal UI

## Local development

```bash
npm install
npm run dev
```

Create a local .env file from .env.example and fill in your own values for local development.

## Deploy to GitHub Pages

This project is configured for GitHub Pages deployment with Vite and GitHub Actions.

### Included changes

- Production builds use the repository subpath from .env.production.
- Routing uses HashRouter so refresh and direct access work on GitHub Pages.
- A workflow is included at .github/workflows/deploy.yml to build and publish the dist folder.
- The GitHub Actions build reads Supabase configuration from repository secrets instead of a committed .env file.

### Before first deployment

1. If your repository name is not travel-pal-ui-fix, update VITE_BASE_PATH in .env.production.
2. Push the repository to GitHub.
3. In the repository settings, add these Actions secrets: VITE_SUPABASE_PROJECT_ID, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_URL.
4. In the repository settings, open Pages and set the source to GitHub Actions.
5. Push to main or master, or run the workflow manually from the Actions tab.

### Build command

```bash
npm run build
```
