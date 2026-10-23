# Engineering Standard — aether-ai-testing

- Prefer deterministic tests and explicit clocks/randomness.
- Separate schema validation from runtime/authorization tests.
- Mock external services and destructive operations by default.
- Every created resource must have a cleanup path.
- Keep fixtures synthetic, minimal, versioned, and sanitized.
- Make flaky tests visible; never silently retry away a product defect.
- Record exact tool versions and commands for release-gate evidence.
- Do not claim a check passed unless the command actually ran.
