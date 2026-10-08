# Repository agent instructions

## GitHub Actions runner policy

- This repository is public and must not use the private `msi` or `deltaopsdev` runner pools without an explicit security review and Simon's authorization.
- Do not introduce an automatic fallback from a self-hosted selector to a GitHub-hosted selector.
- Any future CI design must treat pull-request code as untrusted and document its runner choice before enabling it.
- Xcode/iOS work, if ever added, remains NoMac-only and must use `[self-hosted, macOS, nomac]` after review.

