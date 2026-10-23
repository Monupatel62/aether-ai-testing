# Architecture — aether-ai-testing

## Boundary
This repository owns reusable test fixtures and conventions. It must not become a production runtime dependency.

## Test layers
1. Static and schema validation.
2. Unit tests with deterministic fakes.
3. Consumer/provider contract tests.
4. Integration tests in isolated ephemeral environments.
5. Smoke and release-gate checks with explicit evidence.

## Isolation
Synthetic fixtures by default; unique per-test namespaces; no live external calls unless explicitly opted into a sandbox. Cleanup must run after both success and failure. Artifacts are redacted and access-controlled.
