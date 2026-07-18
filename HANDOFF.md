# Project Handoff

## Repository
https://github.com/zee789456123/meta-title-generator

## Stable branch
main

## Current status

* Repository cleanup completed
* Main website moved to the repository root
* Embeddable versions organized under `embeds/`
* Infinite-loop bug in `embeds/meta-title-preview.html` fixed
* Main generator and preview tested successfully
* Root generator design and mobile layout refined
* Informational, commercial, transactional, and auto-detected intent flows added
* Competitor title patterns now influence suggestions and display a short analysis
* Empty-input validation, linked labels, live status messages, focus handling, and visible focus styles added

## Current task
No active development task. The first design, generation-quality, competitor-analysis, validation, and accessibility pass is complete.

## Next steps

1. Add copy-to-clipboard controls for individual title results
2. Expand keyword extraction for punctuation, short acronyms, and repeated terms
3. Consider richer competitor comparisons such as average length and keyword placement
4. Confirm the final live website URL, then update `sitemap.xml` and `robots.txt`
5. Complete the project license details

## Tests completed

* Main `index.html` loads
* CSS and JavaScript paths resolve
* Suggest Keywords works
* Generate Titles works
* Preview no longer freezes
* No JavaScript syntax errors found
* Root generator creates exactly five titles for informational and transactional intent
* Auto-detect defaults informational content correctly
* Competitor pattern analysis and numeric-title variation work
* Empty keyword/content validation displays an error and returns focus to the keyword field
* Generated titles remain at or below 60 characters in tested cases
* Mobile layout tested at 375px with a single-column grid and no horizontal overflow
* Browser console reports no errors

## Known issues

* No confirmed blocking issues
* Sitemap still needs the final live website URL
* License details may need to be completed

## Project rules

* Pull the latest branch before editing
* Only one coding assistant works at a time
* Preserve existing working functionality
* Do not create duplicate, cache, or temporary files
* Do not add dependencies without approval
* Test changes before committing
* Update this file before handing the project to another assistant
* Commit and push before switching between Claude and Codex
