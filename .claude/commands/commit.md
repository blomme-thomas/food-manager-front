# Angular Code Review

Review only the current changes.

Start with:

git diff --stat
git diff --check
git diff

Review changed files and directly relevant code only.

Check:

- Angular architecture
- component responsibilities
- RxJS
- Signals usage
- HTTP/API integration
- TypeScript
- performance
- subscriptions
- template issues
- tests
- regressions

Do not report cosmetic preferences.

Classify:

CRITICAL
IMPORTANT
MINOR

Do not modify files.
