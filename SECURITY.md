# Security Policy

## Supported Versions

Security updates are currently provided for the latest code on the `main` branch.

Use this table as the current support policy:

| Version                | Supported |
| ---------------------- | --------- |
| `main`                 | Yes       |
| Older releases / forks | No        |

If versioned releases are introduced later, this policy should be updated to
list actively supported release lines.

## Reporting a Vulnerability

If you discover a security vulnerability, please do **not** open a public GitHub
issue.

Instead, report it privately by emailing:

- `security@octometrics.dev`

Please include as much detail as possible:

- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- A proof of concept, sample request, or affected endpoint if available
- Any suggested mitigation or fix, if you have one

If the issue involves secrets, tokens, authentication, request handling,
dependency risk, or data exposure, mention that explicitly in the report.

## Expected Response Time

Project maintainers aim to:

- Acknowledge receipt of a vulnerability report within **72 hours**
- Provide an initial assessment within **7 days**
- Share remediation progress updates as available for valid reports

Resolution time depends on severity, complexity, maintainer availability, and
whether the issue requires coordinated disclosure.

## What to Expect

After you submit a report, maintainers may:

- Request additional reproduction details
- Ask for environment information such as Node.js version or deployment target
- Confirm whether the issue is reproducible
- Coordinate a fix before public disclosure

Please avoid publicly disclosing the vulnerability until maintainers have had a
reasonable opportunity to investigate and ship a fix.

## Security Best Practices

When deploying or contributing to this project, follow these best practices:

- Keep Node.js and npm dependencies up to date
- Regularly audit dependencies with `npm audit`
- Do not commit `.env` files, API tokens, or secrets to the repository
- Use least-privilege GitHub tokens for local development and deployment
- Rotate exposed credentials immediately if you suspect compromise
- Validate and sanitize user input for any new endpoints or query parameters
- Review rate limiting, caching, and error handling when adding API features
- Avoid leaking stack traces, tokens, or internal configuration in responses or logs
- Use HTTPS in production deployments
- Review third-party integrations and frontend proxy behavior before release

## Scope

This policy applies to:

- The Node.js backend in `src/`
- The React/Vite frontend in `ui/`
- Project configuration and deployment workflow files

Third-party services, GitHub itself, Vercel platform infrastructure, or
dependencies maintained by external authors may need to be reported to their
respective maintainers in addition to this project.

## Disclosure Policy

Maintainers will make a reasonable effort to:

- Validate reported vulnerabilities
- Prepare and release a fix when appropriate
- Credit the reporter if they want to be acknowledged

Reporters are asked to act in good faith and avoid:

- Accessing data that does not belong to them
- Disrupting the availability of the service
- Modifying or deleting data on systems they do not own
- Public disclosure before a fix or mitigation is available

Thank you for helping keep OctoMetrics and its users safer.
