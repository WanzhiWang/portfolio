# Wanzhi (Zoe) Wang — Developer Portfolio

[Live website](https://wanzhiwang.github.io/portfolio/) · [GitHub repository](https://github.com/WanzhiWang/portfolio) · [CI/CD runs](https://github.com/WanzhiWang/portfolio/actions)

A responsive personal portfolio built with React and Vite, presenting my background, skills, education, professional experience, projects and gallery. Portfolio content is managed through JSON files, while GitHub Actions checks and deploys the website to GitHub Pages.

## Features

- Responsive bento-style layout and reusable page components.
- Light theme by default for first-time visitors, with a dark-mode toggle and a saved theme preference.
- JSON-driven portfolio content in `public/profile/`.
- Shared `useFetch` hook for JSON requests, loading/error states and request cancellation.
- Lazy-loaded section components using `React.lazy` and `Suspense`.
- Project search across titles, descriptions and technology tags, ignoring case.
- Technology filtering based on existing project tags, combined with search.
- Clear filters, result counts and a no-results message.
- GSAP staggered fade-in animations on project cards, respecting reduced-motion preferences.
- Gallery image previews and Show more controls where applicable.
- EmailJS contact form with required name and message fields and an optional email address.
- Contact validation, sending state, success/error feedback and form reset after successful submission.
- PropTypes for component props and JSDoc documentation for major components and custom hooks.
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
│   │   ├── useDarkMode.js     # Theme state and persistence
│   │   └── useFetch.js        # Shared JSON requests and request lifecycle
│   ├── tests/
│   │   ├── App.test.jsx
│   │   ├── Projects.test.jsx
│   │   ├── Contact.test.jsx
│   │   ├── useDarkMode.test.jsx
│   │   └── useFetch.test.jsx
│   ├── setupTests.js          # Shared test setup
│   └── theme/                 # Theme values and global styles
├── .env.local                 # Local EmailJS configuration; not committed
├── package.json
├── package-lock.json          # Reproducible dependency installation
└── vite.config.js
```

The tree highlights the main files rather than every component. Page components handle presentation and interaction, JSON files hold portfolio content, and theme files centralise shared colours and design tokens.

## Architecture and Data Flow

| Area | Responsibility |
| --- | --- |
| Application shell | `App.jsx` supplies routing and theme providers; `MainApp.jsx` renders configured routes |
| Components | Pages render content and manage local interactions such as search, filtering and image previews |
| Theme and state | Context shares theme state; `useDarkMode` persists the preference; theme tokens supply CSS variables |
| Data and access | JSON files store content, `endpoints.js` defines paths, and `useFetch` manages requests |

The JSON data flow is: endpoint configuration → `useFetch` → component rendering. The hook returns `{ data, loading, error }`, checks HTTP responses, parses JSON and aborts requests on unmount or URL changes. An active-request guard prevents late results from overwriting state after cleanup. Components retain responsibility for checking the data shape they require and for choosing their loading/error presentation. The hook does not implement caching or automatic retries.

The shared hook replaces repeated request blocks in About, Education, Experience, Skills, Gallery, Home, Social, NavBar, MainApp and Projects. Contact continues to use EmailJS because sending a message is a separate operation from loading JSON.

Home is statically imported as the entry page, while section components are lazy-loaded to defer their JavaScript until visited. Lazy component definitions are kept outside rendering so their identities remain stable. HashRouter supports static hosting without server rewrites. The existing theme-toggle import includes a compatibility workaround for its CommonJS export shape.

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

### Automated Tests

Tests are grouped in `src/tests/` and use Vitest with React Testing Library. The suite contains 36 test cases across five files:

| File | Cases | Behaviour checked |
| --- | --- | --- |
| `App.test.jsx` | 1 | Application rendering smoke test |
| `Projects.test.jsx` | 10 | Loaded content; case-insensitive title, description and tag search; technology filtering; combined filters; clearing; HTTP, network and data-shape errors |
| `Contact.test.jsx` | 9 | Required and optional fields; submitted values; whitespace and email validation; success/reset; failure/preserved input; disabled submission while sending |
| `useDarkMode.test.jsx` | 9 | Default and saved preferences; toggle/enable/disable; persistence across remounts; storage read/write failures |
| `useFetch.test.jsx` | 7 | Loading/success; HTTP, network and JSON errors; cancellation; error recovery; stale-response protection |

Network requests and EmailJS are mocked, so the tests do not send real messages or consume email quota. Projects tests mock GSAP to focus on functional behaviour. These tests do not establish complete code coverage or verify visual animation quality and real email delivery.

Run all tests with `npm test`, or target a file:

```bash
npm test -- src/tests/useFetch.test.jsx
```


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

## Attribution and License

Customised by [Wanzhi Wang](https://github.com/WanzhiWang) for a personal developer portfolio.

Based on [Dev Portfolio](https://github.com/mayankagarwal09/dev-portfolio) by [Mayank Agarwal](https://github.com/mayankagarwal09). Original attribution and the MIT license notice are retained in [LICENSE.md](LICENSE.md).
