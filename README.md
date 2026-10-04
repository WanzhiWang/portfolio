# Dev Portfolio
## A minimal portfolio template for Developers!

## Features

⚡️ Modern **bento** UI — dark-first, with a light-theme toggle\
⚡️ Built with React 18 + Vite\
⚡️ Design-token theming (restyle the whole site from one place) + refined web fonts\
⚡️ Reveal animations & fully responsive\
⚡️ Data-driven and easily customizable via JSON\
⚡️ Well organized documentation





## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites 📋

You'll need [Git](https://git-scm.com) and [Node.js **18+**](https://nodejs.org/en/download/) (which comes with [NPM](http://npmjs.com)) installed on your computer.

Also, you can use [Yarn](https://yarnpkg.com/) instead of NPM ☝️

> This project is built with [Vite](https://vitejs.dev/) and React 18.

## Setup 🔧

From your command line, first clone Dev Portfolio:

```bash
# Clone the repository
$ git clone https://github.com/mayankagarwal09/dev-portfolio

# Move into the repository
$ cd dev-portfolio

# Remove the current origin repository
$ git remote remove origin
```

After that, you can install the dependencies either using NPM or Yarn.

Using NPM: Simply run the below commands.

```bash
# Install dependencies
$ npm install

# Start the development server
$ npm run dev
```

Using Yarn:

```bash
# Install dependencies
$ yarn

# Start the development server
$ yarn dev
```

Once your server has started, go to this url `http://localhost:3000/` to see the portfolio locally.
The page will reload if you make edits.

To run the test suite ([Vitest](https://vitest.dev/)):

```bash
$ npm test
```


---

## Deployment 📦

Once you finish your setup. You need to put your website online!

First create a production build. Vite outputs the static site to the `build/` folder:

```bash
$ npm run build
```

Deploy that `build/` folder to any static host. I highly recommend [Vercel](https://vercel.app) because it is super easy.

### Single-page-app routing ☝️

This app uses client-side routing (`BrowserRouter`), so a static host must serve `index.html` for **every** path. Without this, refreshing or directly opening a route like `/projects` returns a **404**. Add the matching rewrite for your host:

- **Vercel** — add a `vercel.json` in the project root:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- **Netlify** — add `public/_redirects`:

```
/*  /index.html  200
```

- **GitHub Pages** — copy `build/index.html` to `build/404.html` after building.


## Authors

- **Mayank Agarwal** - [https://github.com/mayankagarwal09](https://github.com/mayankagarwal09)

## Support

If you find a bug, feel free to [open an issue](https://github.com/mayankagarwal09/dev-portfolio/issues) in this repository.

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

