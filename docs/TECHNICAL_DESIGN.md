# Technical Design — aether-ai-testing

## Test record
Each test run should record commit, tool versions, test selection, environment type, duration, pass/fail/skip, and sanitized artifact references.

## Fixture rules
- Use deterministic identifiers and synthetic payloads.
- Include positive, negative, boundary, malformed, timeout, retry, and authorization cases.
- Test schema-level rejection separately from runtime enforcement.
- Prevent accidental real tool execution or external messages.

## CI safety
Use least-privilege tokens, protected secrets, read-only permissions by default, and ephemeral environments. Destructive tests require an isolated namespace and explicit cleanup.
