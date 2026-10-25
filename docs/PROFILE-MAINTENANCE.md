# Profile Maintenance

Keep the public profile centered on research questions, directions toward doctoral study, Agumon and interactive tools. The public-facing interface and documentation are in English.

- `README.md` is the GitHub profile entry point. It can display images and GIFs, but cannot run custom JavaScript.
- `docs/index.html`, `style.css` and `app.js` provide the interactive site.
- `docs/assets/pet/` contains web derivatives of the existing local Agumon pet. The animation manifest preserves individual frame timings. Updating the site does not alter the local original.
- `docs/public-assets.json` and `ASSETS.md` contain public repositories only. The private inventory remains in the local Obsidian vault and audit folder.
- `docs/assets.html` is a separate, searchable public directory. Account management does not imply sole authorship.
- `scripts/generate_lab_widgets.py` creates the profile's original SVG entry cards.
- `scripts/translate_public_assets_en.py` maintains English directory descriptions while retaining repository links, Fork status and provenance fields.

## Updating the profile

When research directions or personal experience change, revise both the README and the live site. Add specific events, placements, universities, supervisors or admission outcomes only after they have been confirmed. Label new research intersections as questions or proposed directions, not completed findings.

## Checking a change

Check both themes, reduced motion, all four pet actions, research selection, six interactive tools, 320px and 390px layouts, the no-JavaScript fallback and the public asset count. The focus timer uses a deadline and resets on page reload; the visitor's note stays in their own browser.

## Reverting

Revert source changes through Git commits. GitHub Bio, Topics and pinned repositories are separate account settings; consult the local audit snapshot for those. Do not publish credentials or the private repository inventory.
