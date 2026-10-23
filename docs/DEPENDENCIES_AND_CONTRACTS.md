# Dependencies and Contracts — aether-ai-testing

## Dependency boundary
Shared contract fixtures only; test-only dependency, never a production runtime dependency.

## Contracts
- Fixtures are versioned and identify schema/contract revision.
- Test data contains no secrets or real customer content.
- Each integration test declares external resources, permissions, timeout, cleanup, and allowed network access.
- CI artifacts are sanitized and retained only for a documented period.

## Compatibility
Shared fixtures must evolve with versioned contracts; breaking fixture changes require updating all known consumers in the same reviewed change.
