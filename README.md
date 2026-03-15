[![CI](https://octometrics.vercel.app/api/badge/CI-passing?style=for-the-badge)](https://github.com/nikhilmnk/octometrics/actions/workflows/ci.yml)
[![GitHub stars](https://octometrics.vercel.app/api/badges/stars?repo=nikhilmnk/octometrics)](https://github.com/nikhilmnk/octometrics/stargazers)
[![GitHub forks](https://octometrics.vercel.app/api/badges/forks?repo=nikhilmnk/octometrics)](https://github.com/nikhilmnk/octometrics/network/members)
[![GitHub issues](https://octometrics.vercel.app/api/badge/Issues-open?style=for-the-badge)](https://github.com/nikhilmnk/octometrics/issues)
[![License](https://octometrics.vercel.app/api/badges/license?repo=nikhilmnk/octometrics)](./LICENSE)
[![PRs Welcome](https://octometrics.vercel.app/api/badge/PRs-welcome?style=for-the-badge)](./CONTRIBUTING.md)

# OctoMetrics

**OctoMetrics** is an all-in-one GitHub profile analytics engine for generating polished SVG widgets and README-ready visuals.

It helps developers showcase activity, repositories, languages, contribution data, banners, badges, dashboards, and more directly inside GitHub profiles and project documentation.

Keywords: **GitHub README stats**, **GitHub profile widgets**, **GitHub analytics**, SVG widgets, developer portfolio, GitHub profile README.

---

## Discoverability

These keywords help developers discover OctoMetrics when searching for GitHub profile tooling, README generators, analytics widgets, and SVG-based developer portfolio components.

- `github-readme`
- `github-profile`
- `github-stats`
- `developer-analytics`
- `svg-widgets`
- `github-profile-dashboard`
- `nodejs`

---

## Why OctoMetrics?

OctoMetrics is designed for developers who want more than a single stats card.

- Multiple widget types in one project instead of combining several tools
- SVG-first output that embeds cleanly in GitHub READMEs
- Modular backend architecture that is easier to extend with new widgets
- Separate UI builder for composing profile sections visually
- Support for analytics, banners, contribution views, dashboards, and badges from one platform

---

## Live Demo

Try the live project here:

[https://octometrics.vercel.app](https://octometrics.vercel.app)

---

## Preview

<!-- Contributors: update these screenshots when the UI or widget output changes. -->

### Stats Preview

![Stats Preview](docs/stats-preview.png)

<!-- Contributors: replace docs/stats-preview.png with an updated screenshot when the stats UI changes. -->

### Dashboard Preview

![Dashboard Preview](docs/dashboard-preview.png)

<!-- Contributors: replace docs/dashboard-preview.png with an updated screenshot when the dashboard UI changes. -->

---

## Features

OctoMetrics currently provides the following widgets and profile components.

### GitHub Stats

Displays followers, repositories, stars, and account metrics.

```text
/api/stats?username=<github_user>
```

---

### Top Languages

Shows the most used programming languages in repositories.

```text
/api/languages?username=<github_user>&layout=bar&view=all
```

Params: `layout` (`bar` or `circle`), `view` (`top` or `all`), `top` (count).

---

### Top Repositories

Displays the most popular repositories sorted by stars with compact K-formatting.

```text
/api/repos?username=<github_user>&count=6
```

Params: `count` (number to show).

---

### Typing Animation

Animated typing banner for GitHub profiles.

```text
/api/typing?lines=Full+Stack+Developer,Open+Source+Contributor
```

---

### GitHub Streak

Shows current contribution streak, longest streak, and total contributions for the current year.

Note: requires `GITHUB_TOKEN` in `.env`.

```text
/api/streak?username=<github_user>
```

Params: `theme` (`dark`, `light`, `tokyonight`, `dracula`), `credit` (`true` or omitted), `credit_text`, `credit_link`.

---

### Profile Banner Generator

Create a customizable SVG banner with gradient patterns, tech badges, and social tags.

```text
/api/banner?name=YourName&title=Full+Stack+Developer&tech=Node,React,Go&pattern=dots&wave=true
```

Params: `name`, `title`, `subtitle`, `tech`, `location`, `social`, `pattern` (`dots`, `grid`, `none`), `wave` (`true` or `false`), `align` (`center` or `left`).

---

### Contribution Heatmap and 3D Isometric Graph

GitHub-style contribution calendar visualization and isometric 3D bars.

Note: requires `GITHUB_TOKEN` in `.env`.

```text
/api/contributions?username=<github_user>
/api/contributions3d?username=<github_user>
```

---

### Developer Dashboard

All-in-one analytics combining stats, languages, repositories, and contributions.

```text
/api/dashboard?username=<github_user>&layout=default
```

Params: `layout` (`default`, `compact`, `wide`).

---

## Example Usage

Add widgets directly to your GitHub profile README or project documentation.

### GitHub Stats

```md
![Stats](https://octometrics.vercel.app/api/stats?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

### Languages

```md
![Languages](https://octometrics.vercel.app/api/languages?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

### Top Repositories

```md
![Repos](https://octometrics.vercel.app/api/repos?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

### Contribution Heatmap

```md
![Contributions](https://octometrics.vercel.app/api/contributions?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

### GitHub Streak

```md
![Streak](https://octometrics.vercel.app/api/streak?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

### Dashboard

```md
![Dashboard](https://octometrics.vercel.app/api/dashboard?username=yourusername)
```

Small credit line for README users who want to attribute the project:
`Powered by OctoMetrics`

If you like the widgets, you can optionally link back to OctoMetrics in your README. Attribution is encouraged, not required.

---

## Themes

OctoMetrics supports multiple themes.

Available themes:

```text
dark
light
tokyonight
dracula
```

Example:

```text
/api/stats?username=octocat&theme=tokyonight
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/octometrics.git
```

Navigate to the project:

```bash
cd octometrics
```

Install backend dependencies:

```bash
npm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Add your GitHub token:

```env
GITHUB_TOKEN=your_github_token
```

Run the backend development server:

```bash
npm run dev
```

Server default:

```text
http://localhost:3000
```

If you want to run the UI builder as well:

```bash
cd ui
npm install
npm run dev
```

UI default:

```text
http://localhost:5173
```

---

## Architecture

OctoMetrics follows a modular architecture:

```text
router
  -> controllers
    -> services (GitHub API)
      -> engines (data processing)
        -> svg renderers
```

Project structure:

```text
src
├── api
├── config
├── controllers
├── engines
├── middleware
├── services
├── svg
├── themes
└── utils
```

Layer responsibilities:

- `src/api` handles route registration and maps incoming requests to the correct controller.
- `src/controllers` receives requests, validates inputs, coordinates the workflow, and prepares responses.
- `src/services` contains integrations with external systems such as the GitHub API.
- `src/engines` transforms raw data into the computed values needed by each widget.
- `src/svg` renders final SVG output for cards, badges, banners, and visual widgets.
- `src/themes` stores theme definitions and shared styling choices used across widgets.
- `src/utils` provides shared helpers such as sanitization, formatting, caching, and validation utilities.

This separation keeps routing, data fetching, business logic, rendering, and shared helpers isolated from each other, which makes the project easier to maintain and extend.

---

## Deployment

OctoMetrics works well with serverless and modern deployment platforms such as:

- Vercel
- Cloudflare
- Railway

Example deployment using Vercel:

```bash
vercel deploy
```

Set the required environment variable:

```text
GITHUB_TOKEN
```

---

## CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### Automated Testing and Linting

The CI pipeline runs on every push and pull request to the `main` branch and performs:

- ESLint code quality checks
- Prettier formatting validation
- Jest unit tests
- Coverage reporting

### Deployment

Automatic deployment to Vercel occurs on pushes to the `main` branch.

### Required GitHub Secrets

To enable automated deployment, add these secrets in repository settings:

- `VERCEL_TOKEN`: your Vercel authentication token
- `VERCEL_ORG_ID`: your Vercel organization ID
- `VERCEL_PROJECT_ID`: your Vercel project ID

#### How to obtain Vercel secrets

1. Open the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to your project settings.
3. Open the Tokens section to create an auth token.
4. Copy the token, org ID, and project ID.
5. Add them as GitHub repository secrets.

---

## Development

Run the backend locally:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run frontend build:

```bash
cd ui
npm run build
```

For contributor workflow details, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## First Time Contributor Guide

If this is your first open-source contribution, start here:

1. Fork the repository and clone your fork locally.
2. Create a feature branch from `main`.
3. Install dependencies in the root project and in `ui/` if your change touches the frontend.
4. Copy `.env.example` to `.env` and add a valid `GITHUB_TOKEN` if your work depends on GitHub API-backed widgets.
5. Make a focused change and avoid mixing unrelated fixes in the same pull request.
6. Run the relevant checks before opening the PR.
7. Open a pull request with a short explanation, testing notes, and screenshots for UI or SVG output changes.

Good first contribution ideas:

- Improve documentation or examples
- Add tests for existing widgets
- Fix route inconsistencies or validation gaps
- Improve the UI builder experience
- Add a new theme or SVG customization option

If you need the full contribution workflow, review [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Good First Issues

New contributors can start with smaller, lower-risk improvements before taking on larger features.

Good starting areas include:

- Adding new themes
- Improving SVG responsiveness
- Adding caching improvements
- Adding new widgets
- Improving documentation

If you are looking for an entry point, check the repository issues labeled `good first issue`.

---

## Contributing

Contributions are welcome.

If you would like to improve OctoMetrics:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

Please follow the existing architecture and code style.

---

## License

This project is licensed under the MIT License.

---

## Support

If you find OctoMetrics useful, consider giving the project a star on GitHub.

It helps the project reach more developers and signals which widgets are most useful to the community.

---

## Inspired By

Projects that inspired OctoMetrics:

- GitHub Readme Stats
- GitHub Profile Trophy
- GitHub Profile Widgets

OctoMetrics aims to combine the best parts of these tools into a single modular platform.

---

## Future Improvements

Planned features:

- GitHub activity timeline
- Commit streak analytics
- Profile achievements
- Additional themes
- Advanced dashboard widgets

---

Built for the developer community.
