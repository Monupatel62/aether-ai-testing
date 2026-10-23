# Implementation Plan — aether-ai-testing

## Phase 0 — policy
- [ ] Define synthetic-data policy, secret handling, test isolation, and artifact retention.
- [ ] Define required checks for PR and release branches.

## Phase 1 — contract harness
- [ ] Validate JSON Schema and OpenAPI contracts with pinned validators.
- [ ] Run valid/invalid fixture pairs and preserve sanitized output.

## Phase 2 — shared test helpers
- [ ] Add deterministic fakes, clock control, failure injection, and cleanup utilities.
- [ ] Add consumer/provider compatibility checks.

## Phase 3 — CI release gates
- [ ] Add static, unit, contract, security, and non-production smoke checks.
- [ ] Verify CI permissions and artifact redaction.

No implementation phase is marked complete.
