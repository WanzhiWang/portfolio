# Wanzhi (Zoe) Wang — Developer Portfolio

[Live website](https://wanzhiwang.github.io/portfolio/) · [GitHub repository](https://github.com/WanzhiWang/portfolio) · [CI/CD runs](https://github.com/WanzhiWang/portfolio/actions)

A responsive personal portfolio built with React and Vite, presenting my background, skills, education, professional experience, projects and gallery. Portfolio content is managed through JSON files, while GitHub Actions checks and deploys the website to GitHub Pages.

## Features

- Responsive bento-style layout and reusable page components.
- Light theme by default for first-time visitors, with a dark-mode toggle and a saved theme preference.
- JSON-driven portfolio content in `public/profile/`.
- Lazy-loaded section components using `React.lazy` and `Suspense`.
- Project search across titles, descriptions and technology tags, ignoring case.
- Technology filtering based on existing project tags, combined with search.
- Clear filters, result counts and a no-results message.
- GSAP staggered fade-in animations on project cards, respecting reduced-motion preferences.
- Gallery image previews and Show more controls where applicable.
- EmailJS contact form with required name and message fields and an optional email address.
- Contact validation, sending state, success/error feedback and form reset after successful submission.
- PropTypes for component props and JSDoc documentation for added components and functions.
- Automated linting, testing, production builds and deployment.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, JavaScript, Vite |
| Routing | React Router with HashRouter |
| Styling | CSS, Bootstrap, React Bootstrap, styled-components |
| Animation | GSAP, @gsap/react; react-awesome-reveal on other sections |
| State | React hooks and Context; localStorage for theme preference |
| Email integration | EmailJS browser SDK |
| Quality checks | ESLint, Vitest, React Testing Library |
| Hosting and automation | GitHub Pages, GitHub Actions |

## Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml         # Automated checks and deployment
├── public/
│   ├── images/                # Portfolio images
│   └── profile/               # JSON content and navigation configuration
├── src/
│   ├── App.jsx                # Router and theme providers
│   ├── AppContext.js          # Shared theme context
│   ├── MainApp.jsx            # Route rendering and lazy-loaded sections
│   ├── components/
│   │   ├── Contact.jsx        # EmailJS contact form
│   │   ├── Projects.jsx       # Search, filtering and GSAP animation
│   │   ├── Gallery.jsx
│   │   ├── NavBar.jsx
│   │   └── projects/
│   │       └── ProjectCard.jsx
│   ├── constants/
│   │   └── endpoints.js       # Local JSON resource paths
│   ├── css/                   # Section-specific styles
│   ├── hooks/
│   │   └── useDarkMode.js     # Theme state and persistence
│   └── theme/                 # Theme values and global styles
├── .env.local                 # Local EmailJS configuration; not committed
├── package.json
├── package-lock.json          # Reproducible dependency installation
└── vite.config.js
```

The tree highlights the main files rather than every component. Page components handle presentation and interaction, JSON files hold portfolio content, and theme files centralise shared colours and design tokens.

## Local Setup

Use Git and a current Node.js 22 release with npm to match the CI environment.

```bash
git clone https://github.com/WanzhiWang/portfolio.git
cd portfolio
npm ci
```

Configure EmailJS as described below, then start the development server:

```bash
npm run dev
```

Open the URL printed by Vite. The project uses port 3000 with the `/portfolio/` base path.

## EmailJS Configuration

The Contact page sends messages through EmailJS without a custom backend.

1. Connect an email service in the EmailJS dashboard.
2. Create an email template and set **To Email** to a fixed receiving address.
3. Use `{{from_name}}`, `{{reply_to}}` and `{{message}}` as the template variables.
4. Keep the sender address associated with the connected service. If using `{{reply_to}}` in Reply-To, verify that an empty optional email is accepted by the template.
5. Create `.env.local` in the project root:

```dotenv
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Restart the development server after changing these values. Keep `.env.local` excluded from Git, for example through the `*.local` ignore rule.

These are browser-side configuration values. Vite embeds `VITE_` variables into the published JavaScript, so they must not contain private keys, passwords or other server-side secrets. EmailJS availability and account quotas affect message delivery.

## Updating Portfolio Content

Edit the corresponding files in `public/profile/`:

| File | Content |
| --- | --- |
| `home.json`, `about.json` | Introduction and biography |
| `skills.json` | Skills and categories |
| `education.json`, `experiences.json` | Education and employment history |
| `projects.json` | Project titles, Markdown descriptions, images, links and tags |
| `gallery.json` | Gallery images and titles |
| `navbar.json`, `routes.json` | Navigation and section routes |
| `social.json` | Social profile links |

Project search uses `title`, `bodyText` and `tags`; filter options are generated from the tags. Search and filtering are applied together. Updating content for existing pages generally does not require changing the presentation components. A new page also requires a component and an entry in the lazy component mapping in `MainApp.jsx`.

Keep JSON valid and check that image paths match files under `public/images/`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependency versions from the committed lock file |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check source code with ESLint |
| `npm test` | Run the Vitest suite once |
| `npm run build` | Generate the production website in `build/` |
| `npm run preview` | Preview the production build locally |

The current automated test suite contains a basic application rendering test. It is a smoke test, not full coverage of the contact, search or deployment flows.

### Manual Walkthrough

- Check navigation, mobile layout and both themes.
- Confirm the saved theme is restored after refresh; light mode is the default when no preference is saved.
- Search with uppercase and lowercase text and with title, description and tag terms.
- Combine a search term with a technology filter, check no-result behaviour, and clear the filters.
- Confirm project animations complete and reduced-motion users can still see the cards.
- Open and close gallery previews.
- Submit Contact with a name and message while leaving email empty; verify receipt.
- Check required fields and invalid email formats when an email is provided.
- Verify contact feedback on failure and successful delivery on the deployed website.

## CI/CD and Deployment

The workflow is defined in `.github/workflows/deploy.yml`.

| Trigger | Behaviour |
| --- | --- |
| Push to `master` | Run checks, build and deploy |
| Pull request targeting `master` | Run checks and build without deploying |
| Manual workflow run | Run checks and deploy the selected branch, subject to environment rules |

The build job checks out the repository, sets up Node.js 22, installs dependencies with `npm ci`, runs ESLint and Vitest, and builds the production site. For deployment runs it uploads `build/` as a Pages artifact. The deployment job runs only after the build job succeeds and publishes that artifact to GitHub Pages. Failed checks stop the new release.

### Repository Settings

1. Under **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
2. Under **Settings → Secrets and variables → Actions**, add repository secrets named:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
3. The workflow supplies these values to the production build. Repository secret storage does not make browser-embedded values private.
4. Commit `package-lock.json`; it is required by `npm ci` and the npm cache configuration.
5. Push changes to `master` and inspect the workflow under **Actions**.

Vite uses `base: '/portfolio/'` and writes its output to `build/`. HashRouter keeps client-side routes after `#`, so direct navigation and refresh do not require server-side route rewrites. For example:

```text
https://wanzhiwang.github.io/portfolio/#/projects
https://wanzhiwang.github.io/portfolio/#/contact
```

If the repository name or hosting path changes, update Vite's base setting and check resource paths.

## Enhancements and Limitations

The inherited project already provided JSON-driven sections, theme support, component separation, PropTypes and lazy-loading infrastructure. This iteration added the EmailJS Contact page, project search and tag filtering, GSAP project animations, an explicit lazy component mapping, light mode as the initial default, and GitHub Actions deployment. Styling was also adjusted for consistent input and button backgrounds.

The site remains a static frontend. Contact messages depend on EmailJS rather than a locally hosted backend, and content updates are made through JSON files rather than an administration interface. The theme toggle's transitive `lottie-web` dependency may produce an `eval` warning during production builds; the warning is separate from application code and does not by itself indicate a failed build. Automated testing currently covers basic rendering only.

## Attribution and License

Customised by [Wanzhi Wang](https://github.com/WanzhiWang) for a personal developer portfolio.

Based on [Dev Portfolio](https://github.com/mayankagarwal09/dev-portfolio) by [Mayank Agarwal](https://github.com/mayankagarwal09). Original attribution and the MIT license notice are retained in [LICENSE.md](LICENSE.md).

## References

- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/guide/)
- [React Router documentation](https://reactrouter.com/)
- [GSAP React integration](https://gsap.com/resources/React/)
- [EmailJS React integration](https://www.emailjs.com/docs/examples/reactjs/)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vitest documentation](https://vitest.dev/guide/)
