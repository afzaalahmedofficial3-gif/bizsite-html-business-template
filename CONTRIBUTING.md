# Contributing to BizSite

Thank you for your interest in improving BizSite! Contributions of all
kinds are welcome — bug reports, fixes, accessibility improvements, new
sections and documentation tweaks.

## Getting started

1. Fork the repository.
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/bizsite-template.git
   cd bizsite-template
   ```

3. Open `index.html` in your browser. There is no build step and there
   are no dependencies to install.

## Making changes

- Create a descriptive branch: `git checkout -b feature/short-description`
  or `git checkout -b fix/short-description`.
- Keep the project dependency-free: plain HTML, CSS and vanilla
  JavaScript only. Please do not add frameworks, libraries or CDN links.
- Follow the existing code style:
  - CSS lives in `assets/css/style.css`, organised with section comments
    and CSS variables for colours, fonts and spacing.
  - JavaScript lives in `assets/js/script.js` and should stay small and
    readable — this template intentionally favours CSS over JS.
  - Use semantic HTML5 elements and keep pages accessible (labels,
    `aria-*` attributes where interactive, visible focus states,
    descriptive `alt` text).
- Test your change at mobile, tablet and desktop widths, and in both
  light and dark mode.

## Submitting a pull request

1. Commit with a clear message, e.g. `Add keyboard support to FAQ accordion`.
2. Push your branch and open a pull request against `main`.
3. Describe what you changed and why, and include screenshots for visual
   changes if you can.

## Reporting bugs

Open an issue with:

- What you expected to happen and what actually happened.
- Steps to reproduce the problem.
- Your browser and device / screen size.
- A screenshot, if the issue is visual.

By contributing, you agree that your contributions will be licensed
under the project's MIT License.
