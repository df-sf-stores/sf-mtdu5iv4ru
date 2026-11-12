# AGENTS.md: this store's site

**A push to `main` goes live by itself.** The platform builds the pushed commit, checks it, and puts it
on the store's live address. A change that breaks the theme rules is refused, and the site stays as it was.

**Before every push to `main`, run:**

```bash
pnpm check
```

It runs the build's theme rules on the files git holds, then the TypeScript check, and prints each problem
as `file:line  rule  message`. Fix every problem it prints, and `git add` any file it says is not added or
changed since `git add`, before you commit and push. A few rules need the store's own data, so only the build checks them; `pnpm check` names
them at the end.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
