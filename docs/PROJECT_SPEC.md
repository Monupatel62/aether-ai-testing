# Project Specification — aether-ai-testing

## Purpose
Shared fixtures, contract/integration/smoke tests, CI quality gates, test-environment conventions, and failure-injection utilities.

## Scope
- Synthetic fixtures, consumer/provider contract tests, test pyramid, flaky-test policy, test secret handling, isolation, and failure injection.
- Provide reusable test conventions without coupling production services to the test repository.
- Require test evidence and artifact provenance for release gates.

## Out of scope
Production runtime libraries, real customer datasets, and unreviewed access to live services.

## Acceptance criteria
- Tests are deterministic where possible and isolated from production.
- External side effects are mocked by default.
- Failures produce sanitized artifacts and reliable cleanup.

## Status
Documentation only; no test harness source, package manifest, tests, or CI workflow was found in the inspected default-branch tree.
